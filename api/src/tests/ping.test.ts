import { FastifyInstance } from 'fastify';
import { build } from '../helpers/app';

describe('Ping endpoint', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /ping should return pong', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/ping'
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toBe('pong\n');
  });
});