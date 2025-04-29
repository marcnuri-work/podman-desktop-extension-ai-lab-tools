/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

/* eslint-env node */
import { join } from 'node:path';
import * as path from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

let filename = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.dirname(filename);

const AI_LAB_FRONTEND = path.resolve(__dirname, 'node_modules', 'podman-desktop-extension-ai-lab-frontend');
const AI_LAB_SHARED = path.resolve(__dirname, 'node_modules', 'podman-desktop-extension-ai-lab-shared');

console.log(join(AI_LAB_FRONTEND, 'src') + '/');
// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '@podman-desktop/api': path.resolve(__dirname, 'src', 'frontend', '@podman-desktop', 'api.ts'),
      '/@/': join(AI_LAB_FRONTEND, 'src') + '/',
      '@shared/': join(AI_LAB_SHARED, 'src') + '/',
    },
  },
  plugins: [ svelte({ hot: !process.env.VITEST }), tailwindcss()],
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    assetsDir: '.',
    emptyOutDir: true,
    reportCompressedSize: false,
  },
});
