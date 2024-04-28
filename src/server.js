import './utils/env.js';
import { app } from './app.js';
const port = process.env.PORT || 80;

const server = app.listen(port, async () => {
  console.log(`Server was started on http://localhost:${port}`);
});

function gracefulShutdown() {
  console.log('Received kill signal, shutting down gracefully.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', gracefulShutdown);

process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at: ', promise, ' reason: ', reason);
});
