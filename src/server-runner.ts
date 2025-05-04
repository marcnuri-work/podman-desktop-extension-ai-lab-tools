import express from 'express';
import * as http from 'node:http';
import path, {join} from 'node:path';
import { fileURLToPath } from 'node:url';
import {createServer, ViteDevServer} from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

const __dirname: string = fileURLToPath(new URL('.', import.meta.url));
const port: number = 5173;
const mode: string = 'development';
const root: string = path.join(__dirname, '..');
const aiLabFrontend = path.resolve(root, 'node_modules', 'podman-desktop-extension-ai-lab-frontend');
const aiLabShared = path.resolve(root, 'node_modules', 'podman-desktop-extension-ai-lab-shared');

let vite: ViteDevServer;
let app: express.Express;
let server: http.Server;
process.on('SIGINT', () => {
  console.log('SIGINT received, closing server...');
  const closing: Promise<void>[] = [];
  if (vite) {
    closing.push((async () => {
      await vite.close();
      console.log('Vite server closed');
    })());
  }
  if (server) {
    closing.push(new Promise<void>(
      (resolve) => {
        server.close(() => {
          console.log('Express server closed');
          resolve();
        });
      }));
  }
  Promise.all(closing)
    .then(() => {
      console.log('All servers closed');
      process.exit(0);
    })
    .catch(e => {
      console.error('Error closing servers:', e);
      process.exit(1);
    });
});

try {
  vite = await createServer({
    configFile: false,
    mode,
    root,
    resolve: {
      alias: {
        '@podman-desktop/api': path.resolve(root, 'src', 'frontend', '@podman-desktop', 'api.ts'),
        '/@/': join(aiLabFrontend, 'src') + '/',
        '@shared/': join(aiLabShared, 'src') + '/',
      },
    },
    plugins: [svelte(), tailwindcss()],
    build: {
      sourcemap: true,
      assetsDir: '.',
      emptyOutDir: true,
      reportCompressedSize: false,
    },
    server: {
      middlewareMode: true,
      fs: {
        strict: true,
        allow: [
          root,
          '/home/user/00-MN/projects/forks/podman-desktop-extension-ai-lab'
        ]
      },
      open: false,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3000,
      },
    },
  });

  vite.bindCLIShortcuts({ print: true });

  app = express();
  app.use(vite.middlewares);
  app.use(express.json());
  server = app.listen(port);
  console.log(`Server started, listening on port ${port}`);
} catch (e) {
  console.error('Error starting server:', e);
  process.exit(1);
}

