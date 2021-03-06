const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const agent = request.agent(app);

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('signs up user via post', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'omelette', password: 'hehe' });

    expect(res.body).toEqual({ id: expect.any(String), username: 'omelette' });
  });

  it('logs in user via post', async () => {
    const user = await UserService.create({
      username: 'omelette',
      password: 'hehe',
    });
    const res = await agent
      .post('/api/v1/auth/signin')
      .send({ username: 'omelette', password: 'hehe' });

    expect(res.body).toEqual({
      message: 'youre in',
      user,
    });
  });

  it('logsout user via delete', async () => {
    const user = await UserService.create({
      username: 'omelette',
      password: 'hehe',
    });
    await agent
      .post('/api/v1/auth/signin')
      .send({ username: user.username, password: user.password });
    const res = await agent.delete('/api/v1/auth/sessions');
    expect(res.body).toEqual({
      message: 'signed out!',
      success: true,
    });
  });

  it('allows user to view secrets', async () => {
    await UserService.create({
      username: 'omelette',
      password: 'hehe',
    });

    let res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(401);

    await agent
      .post('/api/v1/auth/signin')
      .send({ username: 'omelette', password: 'hehe' });
    res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(200);
  });


  it('sets current user', async () => {
    await UserService.create({
      username: 'omelette',
      password: 'hehe',
    });

    await agent
      .post('/api/v1/auth/signin')
      .send({ username: 'omelette', password: 'hehe' });

    const res = await agent.get('/api/v1/auth/me');

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'omelette',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('protects routes using authenticate', async () => {
    await UserService.create({
      username: 'omelette',
      password: 'hehe',
    });

    await agent
      .post('/api/v1/auth/signin')
      .send({ username: 'omelette', password: 'hehe' });
    const res = await agent.get('/api/v1/auth/private');

    expect(res.body).toEqual({
      message: 'Please login first',
    });
  });

  it('allows user to create secret', async () => {
    const expected = {
      title: 'Test',
      content: 'Test content',
      created_at: expect.any(String),
    };
    await UserService.create({
      username: 'omelette',
      password: 'hehe',
    });

    await agent
      .post('/api/v1/auth/signin')
      .send({ username: 'omelette', password: 'hehe' });
    await agent.get('/api/v1/secrets');
    const res = await agent.post('/api/v1/secrets').send(expected);

    expect(res.body).toEqual({ id: expect.any(String), ...expected });
  });

});
