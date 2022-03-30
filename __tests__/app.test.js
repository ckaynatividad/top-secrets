const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

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
    const res = await request(app)
      .post('/api/v1/auth/signin')
      .send({ username: 'omelette', password: 'hehe' });

    expect(res.body).toEqual({
      message: 'youre in',
      user,
    });
  });
});
