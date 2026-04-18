const express = require('express');
const helmet = require('helmet');
const pino = require('pino');
const client = require('prom-client');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Prometheus Metrics Setup
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// Custom Metrics
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestCounter);

const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
});

const app = express();
const port = process.env.PORT || 3005;

// Environment Validation
if (!process.env.NODE_ENV) {
  logger.warn('NODE_ENV is not set. Defaulting to development.');
}

// Request Timeout Middleware (30 seconds)
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    logger.warn({ url: req.url }, 'Request timed out');
    res.status(408).send('Request Timeout');
  });
  next();
});

// Security Middlewares
app.use(helmet());

// Logging & Metrics Middleware
app.use((req, res, next) => {
  const requestId = req.get('X-Request-Id') || uuidv4();
  req.id = requestId;
  res.set('X-Request-Id', requestId);

  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.url,
      status_code: res.statusCode
    });
  });

  logger.info({
    requestId: req.id,
    method: req.method,
    url: req.url
  }, 'Incoming Request');

  next();
});

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the Automated Node.js Jenkins Pipeline API!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const os = require('os');
app.get('/api/system', (req, res) => {
  res.json({
    uptime: os.uptime(),
    platform: os.platform(),
    loadavg: os.loadavg(),
    freeMem: os.freemem(),
    totalMem: os.totalmem(),
    cpus: os.cpus().length
  });
});

// Error handling
app.use((err, req, res, _next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

let server;
if (require.main === module) {
  server = app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

// Graceful shutdown
const shutdown = () => {
  logger.info('Received shutdown signal. Closing server...');
  if (server) {
    server.close(() => {
      logger.info('Server closed. Exiting process.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
