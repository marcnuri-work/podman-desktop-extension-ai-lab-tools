import path, {join} from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from "@tailwindcss/vite";

const __dirname: string = fileURLToPath(new URL('.', import.meta.url));
const mode: string = 'development';
const root: string = path.join(__dirname, '..');
const aiLabFrontend = path.resolve(root, 'node_modules', 'podman-desktop-extension-ai-lab-frontend');
const aiLabShared = path.resolve(root, 'node_modules', 'podman-desktop-extension-ai-lab-shared');

const server = await createServer({
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
    fs: {
      strict: true,
      allow: [
        root,
        '/home/user/00-MN/projects/forks/podman-desktop-extension-ai-lab'
      ]
    },
    port: 5173,
    strictPort: true,
    host: 'localhost',
    open: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
  },
})

await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
