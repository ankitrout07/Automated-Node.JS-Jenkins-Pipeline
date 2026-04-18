const request = require('supertest');
const { expect } = require('chai');
const app = require('./index');

describe('Automated Node.js App - Integration Tests', () => {
  it('GET / should return the operational dashboard (HTML)', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
    expect(res.header['content-type']).to.include('text/html');
    expect(res.text).to.include('Operational Dashboard');
  });

  it('GET /api should return success message and version JSON', async () => {
    const res = await request(app).get('/api');
    expect(res.status).to.equal(200);
    expect(res.header).to.have.property('x-request-id');
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('version', '1.0.0');
  });

  it('GET /healthz should return 200 OK', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).to.equal(200);
    expect(res.text).to.equal('OK');
  });

  it('GET /metrics should return Prometheus metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).to.equal(200);
    expect(res.header['content-type']).to.include('text/plain');
    expect(res.text).to.include('http_requests_total');
  });

  it('GET /api/system should return system information', async () => {
    const res = await request(app).get('/api/system');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('uptime');
    expect(res.body).to.have.property('platform');
    expect(res.body).to.have.property('loadavg');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).to.equal(404);
  });
});
