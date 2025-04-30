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
          timestamp: Date.now() - 5000,
        } as SystemPrompt,
        { id: '1-2', role: 'user', content: 'Hello, how are you?', timestamp: Date.now() - 5000 } as UserChat,
        {
          id: '1-3',
          role: 'assistant',
          content: 'I am fine, thank you!',
          completed: Date.now() - 4000,
          timestamp: Date.now() - 4500,
        } as AssistantChat,
        { id: '1-4', role: 'user', content: 'What can you do?', timestamp: Date.now() - 4000 } as UserChat,
        {
          id: '1-5',
          role: 'assistant',
          content: 'I can assist you with various tasks.',
          completed: Date.now() - 3000,
          timestamp: Date.now() - 3500,
        } as AssistantChat,
        {
          id: '1-6',
          role: 'user',
          content: 'Check the weather at Don Benito',
          timestamp: Date.now() - 3000,
        } as UserChat,
        {
          id: '1-7',
          role: 'assistant',
          content: { type: 'tool-call', toolCallId: '1-7', toolName: 'weather', args: { location: 'Don Benito' } },
          completed: Date.now() - 2000,
          timestamp: Date.now() - 2500,
        } as AssistantChat,
      ],
    },
  ];
}
