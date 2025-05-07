export interface Webview {
  postMessage(message: unknown): Promise<boolean>;
}
