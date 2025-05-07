import {createOpenAICompatible} from '@ai-sdk/openai-compatible';
import {afterEach, beforeEach, describe, test} from 'vitest';
import {generateText, simulateStreamingMiddleware, streamText, wrapLanguageModel} from 'ai';
import {
  type McpClient,
  type McpServer,
  McpServerType,
} from 'podman-desktop-extension-ai-lab-backend/src/models/mcpTypes';
import {toMcpClients} from 'podman-desktop-extension-ai-lab-backend/src/utils/mcpUtils';
import {ProxyServer} from './';

const MODEL_NAME = 'granite3.3:latest';
const SYSTEM_PROMPT =
  'Knowledge Cutoff Date: April 2024.\n' +
  `Today's Date: ${new Date().toISOString().split('T')[0]}.\n` +
  'You are Granite, developed by IBM. You are a helpful AI assistant with access to the tools listed next. ' +
  "When a tool is required to answer the user's query, respond with `<tool_call>` followed by a JSON object of the tool used. " +
  'For example: `<tool_call> {"name":"function_name","arguments":{"arg1":"value"}} </tool_call>` or if it has no arguments `<tool_call> {"name":"function_name","arguments":{}} </tool_call>`' +
  'The user will respond with the output of the tool execution response so you can continue with the rest of the initial user prompt (continue).\n' +
  'If a tool does not exist in the provided list of tools, notify the user that you do not have the ability to fulfill the request.';

describe('Generate', () => {
  let proxyServer: ProxyServer;
  let mcpClients: McpClient[];

  beforeEach(async () => {
    proxyServer = new ProxyServer();
    await proxyServer.start();
    mcpClients = await toMcpClients({
      enabled: true,
      name: 'podman-mcp-server',
      type: McpServerType.STDIO,
      command: 'npx',
      args: ['-y', 'podman-mcp-server'],
    } as McpServer);
  });
  afterEach(async () => {
    await proxyServer.close();
    mcpClients.forEach((c: McpClient) => c.close());
  });
  test(
    'doGenerate',
    async () => {
      const tools = await mcpClients[0].tools();
      const openAiClient = createOpenAICompatible({
        name: MODEL_NAME,
        baseURL: `http://localhost:${proxyServer.address().port}/v1`,
      });
      let model = openAiClient(MODEL_NAME);
      const response = await generateText({
        model,
        tools,
        maxSteps: 10,
        system: SYSTEM_PROMPT,
        prompt: 'List my Podman images and then my Podman containers',
      });
      console.log(response);
    },
    { timeout: 120_000 },
  );
  test(
    'wrapGenerate',
    async () => {
      const tools = await mcpClients[0].tools();
      const openAiClient = createOpenAICompatible({
        name: MODEL_NAME,
        baseURL: `http://localhost:${proxyServer.address().port}/v1`,
      });
      let model = openAiClient(MODEL_NAME);
      model = wrapLanguageModel({ model, middleware: simulateStreamingMiddleware() });
      const finish = new Promise((resolve, reject) => {
        streamText({
          model,
          tools,
          maxSteps: 10,
          system: SYSTEM_PROMPT,
          prompt: 'List my Podman images and then my Podman containers',
          onError: error => {
            reject(error);
          },
          onFinish: event => resolve(event),
        }).consumeStream();
      });
      const response = await finish;
      console.log(response);
    },
    { timeout: 120_000 },
  );
});
