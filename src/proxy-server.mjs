import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';

const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL || 'http://192.168.5.12:11434';

const app = express();
const proxyOptions = {
  target: TARGET_URL,
  changeOrigin: true,
  logLevel: 'debug'
};

app.use('/', createProxyMiddleware(proxyOptions));

const server = app.listen(PORT, () => {
  console.log(`Reverse proxy server started on port ${PORT}`);
  console.log(`Forwarding requests to: ${TARGET_URL}`);
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
  }, 10000); // 10 seconds timeout
});
