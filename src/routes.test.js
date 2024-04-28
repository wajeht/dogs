import request from 'supertest';
import { it, expect, describe } from 'vitest';
import { app as server } from './app.js';
import { loadImages } from './utils/dogs-images.js';

const app = request(server);

describe('healthz', () => {
  it('should be able to get /healthz', async () => {
    const res = await app.get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('ok');
  });
});

describe('/', () => {
  it('should be able to get /', async () => {
    const res = await app.get('/');
    expect(res.status).toBe(200);
    for (const image of await loadImages()) {
      expect(res.text).includes(image);
    }
  });
});

describe('404', () => {
  it('should be able to get 404', async () => {
    const res = await app.get('/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.text).include('404 - who let the dogs out?');
  });
});
