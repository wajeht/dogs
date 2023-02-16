import express from 'express';
import images from './utils/dogs-images.js';
const page = express.Router();

page.get('/health', (req, res) => res.status(200).json({ message: 'ok', date: new Date() }));

page.get('/', (req, res) => {
  throw new Error('xxxxx');
  res.status(200).render('./home.html', {
    images,
  });
});

export default page;
