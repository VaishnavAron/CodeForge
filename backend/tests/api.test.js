const request = require('supertest');
const app = require('../src/index');

describe('CodeForge API Automated Test Suite', () => {

  describe('1. System Health & Monitoring Endpoints', () => {
    it('GET /health should return 200 with ok status and uptime metadata', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'CodeForge Backend API');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('GET /api/health should return 200 with service metadata', async () => {
      const response = await request(app).get('/api/health');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('2. Authentication & Defensive Validation', () => {
    it('POST /user/register should reject empty payload with 400 Bad Request', async () => {
      const response = await request(app)
        .post('/user/register')
        .send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('POST /user/login should reject missing email with 401 Unauthorized', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({ password: 'Password123!' });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('POST /user/login should reject missing password with 401 Unauthorized', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({ emailId: 'test@codeforge.com' });
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('3. Route Security & JWT Authorization Middleware', () => {
    it('GET /user/check without token should return 401 Unauthorized', async () => {
      const response = await request(app).get('/user/check');
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toMatch(/Authentication required/i);
    });

    it('POST /logout without token should return 401 Unauthorized', async () => {
      const response = await request(app).post('/logout');
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toMatch(/Authentication required/i);
    });

    it('POST /problem/create without admin token should return 403 Forbidden', async () => {
      const response = await request(app)
        .post('/problem/create')
        .send({ title: 'Test Problem' });
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toMatch(/Forbidden/i);
    });
  });

  describe('4. CORS Policy & Protocol Verification', () => {
    it('OPTIONS /api/health preflight request should respond with 200 or 204', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'GET');
      expect([200, 204]).toContain(response.statusCode);
    });
  });

});
