import expressLayouts from 'express-ejs-layouts';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import ejs from 'ejs';
import './utils/env.js';

import routes, { notFoundHandler, errorHandler, rateLimitHandler, appVariablesHandler } from './routes.js';

const production = ['prod', 'production'];
const app = express();

if (production.includes(process.env.NODE_ENV.toLowerCase())) {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: rateLimitHandler,
      skip: () => {
        return production.includes(process.env.NODE_ENV.toLowerCase());
      },
    }),
  );
}

app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'default-src': ["'self'", 'plausible.jaw.dev '],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'dogs.jaw.dev',
          'localhost',
          'plausible.jaw.dev',
        ],
      },
    },
  }),
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  express.static(path.resolve(path.join(process.cwd(), 'public')), {
    // 1 year in milliseconds
    maxAge: 31536000000,
  }),
);

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(path.join(process.cwd(), 'src', 'pages')));
app.set('layout', path.resolve(path.join(process.cwd(), 'src', 'layouts', 'normal.html')));

app.use(appVariablesHandler);
app.use(expressLayouts);
app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
