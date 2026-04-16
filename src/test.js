const request = require('supertest');
const { expect } = require('chai');
const app = require('./index');

describe('Automated Node.js App - Integration Tests', () => {
  it('GET / should return success message and timestamp with Request ID', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
    expect(res.header).to.have.property('x-request-id');
    expect(res.body).to.have.property('status', 'success');
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

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).to.equal(404);
  });
});
