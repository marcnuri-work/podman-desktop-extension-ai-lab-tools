import {CatalogManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/catalogManager';
import {PlaygroundV2Manager} from 'podman-desktop-extension-ai-lab-backend/src/managers/playgroundV2Manager';
import type {
  AssistantChat,
  SystemPrompt,
  UserChat
} from '@shared/models/IPlaygroundMessage';

export class ExtendedPlaygroundManager extends PlaygroundV2Manager {

  constructor(
    private catalogManager: CatalogManager,
    appUserDirectory: string,
    rpcExtension: any,
    inferenceManager: any,
    taskRegistry: any,
    telemetryLogger: any,
    cancellationTokenRegistry: any
  ) {
    super(
      appUserDirectory,
      rpcExtension,
      inferenceManager,
      taskRegistry,
      telemetryLogger,
      cancellationTokenRegistry
    );
  }

  async initTestData(): Promise<void> {
    const conversationId = await this.createPlayground('Playground 001', this.catalogManager.getModels()[0], 'playground-001');
    const conversation = this.getConversations().find(c => c.id === conversationId);
    conversation.messages.push(
      {
        id: '1-1',
        role: 'system',
        content: 'You are a helpful assistant.',
        timestamp: Date.now() - 6000,
      } as SystemPrompt,
      { id: '1-2', role: 'user', content: 'What can you do?', timestamp: Date.now() - 5500 } as UserChat,
      {
        id: '1-3',
        role: 'assistant',
        content: 'I can assist you with various tasks like checking the weather.',
        completed: Date.now() - 4500,
        timestamp: Date.now() - 5637,
      } as AssistantChat,
      {
        id: '1-4',
        role: 'user',
        content: 'Check the weather at Don Benito',
        timestamp: Date.now() - 4000,
      } as UserChat,
      {
        id: '1-5',
        role: 'assistant',
        content: {
          type: 'tool-call', toolCallId: '1-7', toolName: 'weather', args: { location: 'Don Benito' },
          result: {
            content: [{type: 'text', text: 'The weather in Don Benito is sunny with a temperature of 25°C.'}],
          }
        },
        completed: Date.now() - 2000,
        timestamp: Date.now() - 2500,
      } as AssistantChat,
      {
        id: '1-6',
        role: 'user',
        content: 'Awesome, now check the weather at Porto',
        timestamp: Date.now() - 2000,
      } as UserChat,
      {
        id: '1-7',
        role: 'assistant',
        content: {
          type: 'tool-call', toolCallId: '1-7', toolName: 'weather', args: { location: 'Porto' },
        },
        timestamp: Date.now() - 2000,
      } as AssistantChat
    );
    conversation.usage = {
      completion_tokens: 37,
        prompt_tokens: 13,
    };
    for (const model of this.catalogManager.getModels()) {
      await this.createPlayground(`Empty and ready (${model.id})`, model, `empty-and-ready-${model.id}`);

    }
  }
}
