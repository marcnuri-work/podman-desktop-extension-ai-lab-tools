import { isMessageRequest } from '@shared/messages/MessageProxy';

export class WebviewApi {
  private readonly interval: number = 200;
  private readonly sessionStorageKey = 'podman-desktop';
  private readonly queue: string[] = [];
  private stopped = false;
  private webSocket: WebSocket;

  constructor() {
    setInterval(this.processQueue.bind(this), this.interval);
  }

  private initWebSocket(): WebSocket {
    const webSocket = new WebSocket('/api');
    webSocket.onclose = event => {
      if (event.code === 1000) {
        this.stopped = true;
      }
    };
    webSocket.onmessage = wsEvent => {
      const event = new Event('message');
      event['data'] = JSON.parse(wsEvent.data);
      console.log(event['data']);
      window.dispatchEvent(event);
    };
    return webSocket;
  }

  private processQueue(): void {
    if (this.stopped) {
      return;
    }
    if (!this.webSocket || this.webSocket.readyState === WebSocket.CLOSED) {
      this.webSocket = this.initWebSocket();
    }
    if (this.webSocket.readyState !== WebSocket.OPEN) {
      return;
    }
    for (let i = 0; i < this.queue.length; i++) {
      const msg = this.queue[i];
      if (msg) {
        this.webSocket.send(msg);
        this.queue.splice(i, 1);
        i--;
      }
    }
  }

  public postMessage(msg: unknown): void {
    console.log(msg);
    if (!isMessageRequest(msg)) {
      return;
    }
    this.queue.push(JSON.stringify(msg));
  }

  public getState(): unknown {
    const state = sessionStorage.getItem(this.sessionStorageKey);
    if (state) {
      return JSON.parse(state);
    }
    return {};
  }

  public async setState(newState: unknown): Promise<void> {
    console.log('setState', newState);
    sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(newState));
  }
}
