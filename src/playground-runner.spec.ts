import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { NoOpTelemetryLogger, StandaloneWebview } from '@podman-desktop/api';
import type { InferenceServer } from '@shared/models/IInference';
import type { ModelInfo } from '@shared/models/IModelInfo';
import { RpcExtension } from '@shared/messages/MessageProxy';
import type { ModelOptions } from '@shared/models/IModelOptions';
import type { ChatMessage } from '@shared/models/IPlaygroundMessage';
import { McpServerManager } from 'podman-desktop-extension-ai-lab-backend/src/managers/playground/McpServerManager';
import { PlaygroundV2Manager } from 'podman-desktop-extension-ai-lab-backend/src/managers/playgroundV2Manager';
import { InferenceManager } from 'podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager';
import { TaskRegistry } from 'podman-desktop-extension-ai-lab-backend/src/registries/TaskRegistry';
import { CancellationTokenRegistry } from 'podman-desktop-extension-ai-lab-backend/src/registries/CancellationTokenRegistry';
import { ProxyServer } from './';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname: string = fileURLToPath(new URL('.', import.meta.url));

describe('Playground Runner', () => {
  let manager: PlaygroundV2Manager;
  let inferenceManager: InferenceManager;
  let proxyServer: ProxyServer;

  beforeEach(async () => {
    proxyServer = new ProxyServer();
    await proxyServer.start();
    const rpcExtension = new RpcExtension(new StandaloneWebview());
    rpcExtension.init();
    // @ts-ignore
    inferenceManager = new InferenceManager() as unknown as InferenceManager;
    const mcpServerManager = new McpServerManager(rpcExtension, path.join(__dirname, '..'));
    mcpServerManager.init();
    manager = new PlaygroundV2Manager(
      rpcExtension,
      inferenceManager,
      new TaskRegistry(rpcExtension),
      new NoOpTelemetryLogger(),
      new CancellationTokenRegistry(),
      mcpServerManager,
    );
    await vi.waitFor(() => expect(mcpServerManager.getMcpSettings()?.servers?.time).not.toBeUndefined());
  });

  afterEach(async () => {
    await proxyServer.close();
  });

  test(
    'CHAT COMPLETIONS',
    async () => {
      const date = new Date(2000, 1, 1, 13);
      vi.setSystemTime(date);
      vi.mocked(inferenceManager.getServers).mockReturnValue([
        {
          status: 'running',
          health: {
            Status: 'healthy',
          },
          models: [
            {
              id: 'nuri-model-id',
              // name: 'nuri-model',
              // name: 'meta-llama/Llama-3.1-8B-Instruct',
              name: 'granite3.3:latest',
              file: {
                file: 'nuri-model.file',
              },
            },
          ],
          connection: {
            port: proxyServer.address().port,
          },
        } as unknown as InferenceServer,
      ]);
      const conversationId = await manager.createPlayground(
        'playground 1',
        { id: 'nuri-model-id' } as ModelInfo,
        'tracking-1',
      );
      expect(conversationId).not.toBeNull();
      // manager.setSystemPrompt(
      //   conversationId,
      //   'Knowledge Cutoff Date: April 2024.\n' +
      //     `Today's Date: ${new Date().toISOString().split('T')[0]}.\n` +
      //     'You are Granite, developed by IBM. You are a helpful AI assistant with access to the tools listed next. ' +
      //     "When a tool is required to answer the user's query, respond with `<tool_call>` followed by a JSON object of the tool used. " +
      //     'For example: `<tool_call> {"name":"function_name","arguments":{"arg1":"value"}} </tool_call>` or if it has no arguments `<tool_call> {"name":"function_name","arguments":{}} </tool_call>`' +
      //     'The user will respond with the output of the tool execution response so you can continue with the rest of the initial user prompt (continue).\n' +
      //     'If a tool does not exist in the provided list of tools, notify the user that you do not have the ability to fulfill the request.',
      // );
      await manager.submit(
        conversationId,
        // 'List my Podman images and then my Podman containers',
        'Get the time in the Paris Timezone',
        {
          temperature: 0.1337,
          max_tokens: 1337,
          top_p: 0,
        } as ModelOptions,
      );
      await vi.waitFor(
        () => {
          const conversations = manager.getConversations();
          expect(conversations[0].messages.length).toBeGreaterThanOrEqual(3);
          expect((conversations[0].messages[2] as ChatMessage).role).toBe('assistant');
          expect((conversations[0].messages[2] as ChatMessage).content).not.toBeUndefined();
          console.log('Assistant message:', (conversations[0].messages[2] as ChatMessage).content);
        },
        { interval: 5000, timeout: 120_000 },
      );
    },
    { timeout: 120_000 },
  );
});
