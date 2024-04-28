/* eslint-disable no-unused-vars */

import express from 'express';
import images from './utils/dogs-images.js';

const page = express.Router();

page.get('/healthz', (req, res) => {
  return res.status(200).json({ message: 'ok', date: new Date() });
});

page.get('/', (req, res) => {
  return res.status(200).render('./home.html', {
    images,
  });
});

export function notFoundHandler(req, res, next) {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  return res.status(404).render('./not-found.html', { randomImage });
}

export function errorHandler(error, req, res, next) {
  return res.status(500).render('./error.html');
}

export function rateLimitHandler(req, res, next) {
  if (req.get('Content-Type') === 'application/json') {
    return res.json({ message: 'Too many requests, please try again later.' });
  }
  return res.status(429).render('./rate-limit.html');
}

export default page;
