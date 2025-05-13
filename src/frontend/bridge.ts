import { WebviewApi } from './webview-api';

Object.defineProperty(window, 'acquirePodmanDesktopApi', {
  value: () => {
    return new WebviewApi();
  },
});

Object.defineProperty(window, 'studioClient', { value: null, configurable: true });
