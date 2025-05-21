const request = require('supertest');
const app = require('../src/app');

describe('GET /users', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.statusCode).toBe(200);
  });
});
