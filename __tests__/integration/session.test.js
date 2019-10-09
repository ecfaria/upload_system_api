const request = require('supertest');
const app = require('../../src/app');
const factory = require('../factories');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should authenticate with valid credentials', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456',
      });

    expect(response.status).toBe(200);
  });

  it('should NOT authenticate with valid credentials', async () => {
    const user = await factory.create('User');
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '654321',
      });

    expect(response.status).toBe(401);
  });

  it('should receive a JWT token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456',
      });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const response = await request(app)
      .get('/dashboard')
      .set('authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes without JWT token', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(401);
  });

  it('should not be able to access private routes with invalid JWT token', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const response = await request(app)
      .get('/dashboard')
      .set('authorization', 'Bearer 123123');

    expect(response.status).toBe(401);
  });
});
