import {Webview} from '@podman-desktop/api';
import * as console from 'node:console';

// @ts-ignore
export class ServerWebview implements Webview {

  postMessage(message: unknown): Promise<boolean> {
    console.log('Webview.postMessage', message);
    return Promise.resolve(true);
  }
}

