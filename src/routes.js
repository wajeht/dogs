/* eslint-disable no-unused-vars */

import express from 'express';
import images from './utils/dogs-images.js';
const page = express.Router();

page.get('/health', (req, res) => res.status(200).json({ message: 'ok', date: new Date() }));

page.get('/', (req, res) => {
  res.status(200).render('./home.html', {
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

export default page;
