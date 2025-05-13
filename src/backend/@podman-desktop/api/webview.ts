import {Emitter, Event} from '@podman-desktop/api';

export interface Webview {
  readonly onDidReceiveMessage: Event<unknown>;
  postMessage(message: unknown): Promise<boolean>;
}

export class StandaloneWebview implements Webview {

  readonly #onDidReceiveMessage: Emitter;
  readonly onDidReceiveMessage: Event<unknown>;

  constructor() {
    this.#onDidReceiveMessage = new Emitter<unknown>();
    this.onDidReceiveMessage = this.#onDidReceiveMessage.event;

  }

  async postMessage(message: unknown): Promise<boolean> {
    return true;
  }
}
