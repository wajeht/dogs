import express from 'express';
const page = express.Router();

page.get('/', (req, res) => res.status(200).render('./home.html'));
page.get('/health', (req, res) => res.status(200).json({ message: 'ok', date: new Date() }));

export default page;
