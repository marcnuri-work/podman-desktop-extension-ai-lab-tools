import * as webviewApi from './webview-api';

Object.defineProperty(window, 'acquirePodmanDesktopApi', {
  value: () => {
    return webviewApi;
  },
});

Object.defineProperty(window, 'studioClient', { value: null, configurable: true });
