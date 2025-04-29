import {getModelsInfo} from "./models";

export const commands = {};
export const configuration = {};
export const containerEngine = {};
export const env = {};
export const extensions = {};
export const fs = {};
export const navigation = {};
export const postMessage = args => {
  console.log(args);
  setTimeout(() => {
    const event = new Event('message');
    let body = {};
    if (args.method === 'getModelsInfo') {
      body = getModelsInfo();
    }
    event.data = {
      id: args.id,
      channel: args.channel,
      status: 'OK',
      body
    };
    window.dispatchEvent(event);
  }, 100);
};
export const process = {};
export const provider = {};
export const version = '1.33.7';

// export const window = {};

export class CancellationTokenSource {
  token: object;

  constructor() {
    this.token = {
      onCancellationRequested: () => {
      },
    };
  }
}

export const Disposable = {};
export const EventEmitter = {};
export const ProgressLocation = {};
export const Uri = {};
