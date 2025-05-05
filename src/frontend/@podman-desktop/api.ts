import { getCatalog } from './catalogs';
import { getInferenceServers } from './inference-servers';
import { getModelsInfo } from './models';
import { getPlaygroundConversations } from './playgrounds';
import { getTasks } from './tasks';

const functions = {
  getCatalog,
  getInferenceServers,
  getModelsInfo,
  getPlaygroundConversations,
  getPodmanDesktopVersion: () => version,
  getTasks,
  readRoute: () => getState()['url'],
};

export const commands = {};
export const configuration = {};
export const containerEngine = {};
export const env = {};
export const extensions = {};
export const fs = {};
export const navigation = {};
export const postMessage = args => {
  console.log(args);
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
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
      id: args.id,
      channel: args.channel,
      status: 'OK',
      body: data,
    };
    window.dispatchEvent(event);
  });
  setTimeout(() => {
    const event = new Event('message');
    let body = {};
    const f = functions[args.method];
    if (f) {
      try {
        body = f(args);
      } catch (e) {
        console.error(e);
      }
    }
    event['data'] = {
      id: args.id,
      channel: args.channel,
      status: 'OK',
      body,
    };
    window.dispatchEvent(event);
  }, 100);
};
export const process = {};
export const provider = {};
export const getState = () => {
  console.log('getState');
  const state = sessionStorage.getItem('podman-state');
  if (state) {
    return JSON.parse(state);
  }
  return {};
};
export const setState = args => {
  console.log('setState', args);
  sessionStorage.setItem('podman-state', JSON.stringify(args));
};
export const version = '1.33.7';

export class CancellationTokenSource {
  token: object;

  constructor() {
    this.token = {
      onCancellationRequested: () => {},
    };
  }
}

export const Disposable = {};
export const EventEmitter = {};
export const ProgressLocation = {};
export const Uri = {};
