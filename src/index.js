const express = require('express');
const helmet = require('helmet');
const pino = require('pino');
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
});

const app = express();
const port = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet());

// Logging Middleware
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming Request');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the Automated Node.js Jenkins Pipeline!',
    timestamp: new Date().toISOString()
  });
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  process.exit(0);
});
