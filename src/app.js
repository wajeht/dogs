/* eslint-disable no-unused-vars */
import expressLayouts from 'express-ejs-layouts';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import ejs from 'ejs';

import routes from './routes.js';

const PORT = 8080;
const app = express();

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  express.static(path.resolve(path.join(process.cwd(), 'public')), {
    maxAge: '24h',
  }),
);

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(path.join(process.cwd(), 'src', 'pages')));
app.set('layout', '../layouts/normal.html');

app.use(expressLayouts);
app.use(routes);

app.use((req, res, nxt) => res.status(404).render('./not-found.html'));
app.use((err, req, res, nxt) => res.status(500).render('./error.html'));

app.listen(PORT, () => console.log(`App was started on http://localhost:${PORT}`));
