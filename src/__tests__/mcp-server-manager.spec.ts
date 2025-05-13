import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { StandaloneWebview } from '@podman-desktop/api';
import { RpcExtension } from '@shared/messages/MessageProxy';
import { McpServerType } from '@shared/models/McpSettings';
import { McpServerManager } from 'podman-desktop-extension-ai-lab-backend/src/managers/playground/McpServerManager';

describe('McpServerManager', () => {
  let consoleErrors: string;
  let consoleWarnings: string;
  let rpcExtension: RpcExtension;
  let appUserDirectory: string;
  let mcpSettingsFile: string;
  let mcpServerManager: McpServerManager;
  beforeEach(async () => {
    vi.resetAllMocks();
    consoleErrors = '';
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      consoleErrors += args.join(' ') + '\n';
    });
    consoleWarnings = '';
    vi.spyOn(console, 'warn').mockImplementation((...args) => {
      consoleWarnings += args.join(' ') + '\n';
    });
    rpcExtension = new RpcExtension(new StandaloneWebview());
    appUserDirectory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'mcp-server-manager-test-'));
    mcpSettingsFile = path.join(appUserDirectory, 'mcp-settings.json');
    mcpServerManager = new McpServerManager(rpcExtension, appUserDirectory);
  });
  afterEach(async () => {
    await fs.promises.rm(appUserDirectory, { recursive: true });
  });
  test('provides an empty default value', () => {
    expect(mcpServerManager.getMcpSettings()).toEqual({ servers: {} });
  });
  describe('with missing mcp-settings.json', () => {
    beforeEach(async () => {
      mcpServerManager.init();
    });
    test('provides an empty default value', () => {
      expect(mcpServerManager.getMcpSettings()).toEqual({ servers: {} });
    });
    test('logs error', () => {
      expect(consoleErrors).toMatch(/unable to watch file/);
      expect(consoleErrors).toMatch(/changes won't be detected/);
    });
  });
  describe('with non-parseable mcp-settings.json', () => {
    beforeEach(async () => {
      await fs.promises.writeFile(mcpSettingsFile, 'not-a-json');
      mcpServerManager.init();
    });
    test('provides an empty default value', () => {
      expect(mcpServerManager.getMcpSettings()).toEqual({ servers: {} });
    });
    test('logs error', async () => {
      await vi.waitFor(() => expect(consoleErrors).not.toBe(''));
      expect(consoleErrors).toMatch(/is not valid JSON/);
    });
    describe('with mcp-settings.json file modified', () => {
      beforeEach(async () => {
        await fs.promises.writeFile(
          mcpSettingsFile,
          JSON.stringify({
            servers: {
              'stdio-ok': { type: 'stdio', enabled: true, command: 'sh -c' },
            },
          }),
        );
        await vi.waitFor(() => expect(mcpServerManager.getMcpSettings().servers).not.toEqual({}));
      });
      test('loads valid servers', () => {
        expect(mcpServerManager.getMcpSettings().servers).toEqual(
          expect.objectContaining({
            'stdio-ok': {
              enabled: true,
              name: 'stdio-ok',
              type: McpServerType.STDIO,
              command: 'sh -c',
            },
          }),
        );
      });
    });
  });
  describe('with parseable mcp-settings.json', () => {
    beforeEach(async () => {
      const mcpSettings = {
        servers: {
          'stdio-ok': {
            enabled: true,
            type: 'stdio',
            command: 'npx',
            args: ['-y', 'kubernetes-mcp-server'],
          },
          'sse-ok': {
            enabled: true,
            type: 'sse',
            url: 'https://echo.example.com/sse',
            headers: {
              foo: 'bar',
            },
          },
          'invalid-type': {
            enabled: true,
            type: 'invalid',
            url: 'https://echo.example.com/sse',
          },
        },
      };
      await fs.promises.writeFile(mcpSettingsFile, JSON.stringify(mcpSettings));
      mcpServerManager.init();
      await vi.waitFor(() => expect(mcpServerManager.getMcpSettings().servers).not.toEqual({}));
    });
    test('loads valid servers', () => {
      expect(mcpServerManager.getMcpSettings().servers).toEqual(
        expect.objectContaining({
          'stdio-ok': {
            enabled: true,
            name: 'stdio-ok',
            type: McpServerType.STDIO,
            command: 'npx',
            args: ['-y', 'kubernetes-mcp-server'],
          },
          'sse-ok': {
            enabled: true,
            name: 'sse-ok',
            type: McpServerType.SSE,
            url: 'https://echo.example.com/sse',
            headers: { foo: 'bar' },
          },
        }),
      );
    });
    test('ignores invalid servers', () => {
      expect(mcpServerManager.getMcpSettings().servers['invalid-type']).toBeUndefined();
      expect(consoleWarnings).toMatch(/Invalid MCP server type invalid for server invalid-type/);
    });
  });
});
