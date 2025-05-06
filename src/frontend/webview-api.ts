import {isMessageRequest} from '@shared/messages/MessageProxy';

export const postMessage = (msg: unknown): void => {
  console.log(msg);
  if (!isMessageRequest(msg)) {
    return;
  }
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(msg),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok');
    })
    .then(data => {
      const event = new Event('message');
      event['data'] = {
        id: msg.id,
        channel: msg.channel,
        status: 'OK',
        body: data,
      };
      window.dispatchEvent(event);
    });
};

const sessionStorageKey = 'podman-desktop';

export const getState = (): unknown => {
  const state = sessionStorage.getItem(sessionStorageKey);
  if (state) {
    return JSON.parse(state);
  }
  return {};
};

export const setState = async (newState: unknown): Promise<void> => {
  console.log('setState', newState);
  sessionStorage.setItem(sessionStorageKey, JSON.stringify(newState));
};
