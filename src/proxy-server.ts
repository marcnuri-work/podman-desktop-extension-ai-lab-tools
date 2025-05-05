import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';

const DEFAULT_PORT = 3000;

const DEFAULT_TARGET_URL = 'http://192.168.5.12:11434';

export const startServer = ({
  port = DEFAULT_PORT,
  targetUrl = DEFAULT_TARGET_URL
} = {}) => {
  const app = express();
  const proxyOptions = {
    target: targetUrl,
    changeOrigin: true,
    logLevel: 'debug'
  };

  app.use('/', createProxyMiddleware(proxyOptions));

  const server = app.listen(port, () => {
    console.log(`Reverse proxy server started on port ${port}`);
    console.log(`Forwarding requests to: ${targetUrl}`);
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received. Shutting down...');
    server.close(() => {
      console.log('Server closed successfully');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10_000);
  });

  return server;
};
