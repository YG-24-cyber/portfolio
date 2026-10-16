import app from './src/app.js';
import { env } from './src/config/env.js';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` TG CONSOLE - Backend API Gateway Server Started`);
  console.log(` Environment: ${env.NODE_ENV}`);
  console.log(` Port:        ${PORT}`);
  console.log(` Health URL:  http://localhost:${PORT}/api/health`);
  console.log(` CORS Client: ${env.CLIENT_URL}`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
const handleGracefulShutdown = (signal) => {
  console.log(`\n Received ${signal}. Gracefully closing server...`);
  server.close(() => {
    console.log(' HTTP server closed cleanly. Process exiting.');
    process.exit(0);
  });

  // Force close after 10 seconds if hanging
  setTimeout(() => {
    console.error(' Forcefully shutting down due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error(' [Unhandled Rejection at Promise]:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error(' [Uncaught Exception]:', err);
  process.exit(1);
});
