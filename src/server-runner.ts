import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer, ViteDevServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { Server } from './backend';

const __dirname: string = fileURLToPath(new URL('.', import.meta.url));
const port: number = 5173;
const mode: string = 'development';
const root: string = path.join(__dirname, '..');
const aiLabFrontend = path.resolve(root, 'node_modules', 'podman-desktop-extension-ai-lab-frontend');
const aiLabShared = path.resolve(root, 'node_modules', 'podman-desktop-extension-ai-lab-shared');

let frontendServer: ViteDevServer;
let backendServer: Server;

process.on('SIGINT', () => {
  console.log('SIGINT received, closing server...');
  const closing: Promise<void>[] = [];
  if (frontendServer) {
    closing.push(
      (async () => {
        await frontendServer.close();
        console.log('Frontend server closed');
      })(),
    );
  }
  if (backendServer) {
    closing.push(backendServer.close());
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

const start = async () => {
  frontendServer = await createServer({
    configFile: false,
    mode,
    root,
    resolve: {
      alias: {
        '/@/': join(aiLabFrontend, 'src') + '/',
        // Fix utils/client being loaded multiple times as  /@/utils/client and ../utils/client
        './utils/client': join(aiLabFrontend, 'src', 'utils', 'client'),
        '../utils/client': join(aiLabFrontend, 'src', 'utils', 'client'),
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
        allow: [root, '/home/user/00-MN/projects/forks/podman-desktop-extension-ai-lab'],
      },
      open: false,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3000,
      },
    },
  });
  frontendServer.bindCLIShortcuts({ print: true });

  backendServer = new Server(root, port, frontendServer);
  await backendServer.init();
};

start().catch(e => {
  console.error('Error starting server:', e);
  process.exit(1);
});
