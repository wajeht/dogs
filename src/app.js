import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import ejs from 'ejs';

import routes, { notFoundHandler, errorHandler, rateLimitHandler } from './routes.js';

dotenv.config(path.resolve(path.join(process.cwd(), '.env')));

const PORT = process.env.PORT || 8080;
const app = express();

if (['prod', 'production'].includes(process.env.ENV.toLowerCase())) {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: rateLimitHandler,
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
          'dogs.jaw.homes',
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
    // 1 year in miliseconds
    maxAge: 31536000000,
  }),
);

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(path.join(process.cwd(), 'src', 'pages')));
app.set('layout', path.resolve(path.join(process.cwd(), 'src', 'layouts', 'normal.html')));

app.use(expressLayouts);
app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => console.log(`App was started on http://localhost:${PORT}`));
