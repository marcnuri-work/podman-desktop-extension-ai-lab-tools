import { AssistantChat, Conversation, SystemPrompt, UserChat } from '@shared/models/IPlaygroundMessage';

export function getPlaygroundConversations(): Conversation[] {
  return [
    {
      id: '1',
      modelId: 'model-1',
      name: 'Conversation 1',
      messages: [
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
        } as AssistantChat,
      ],
      usage: {
        completion_tokens: 37,
        prompt_tokens: 13,
      }
    },
  ];
}
