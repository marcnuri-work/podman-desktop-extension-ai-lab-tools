import * as api from '@podman-desktop/api';

Object.defineProperty(window, 'acquirePodmanDesktopApi', {
  value: () => {
    return api;
  }
});

Object.defineProperty(window, 'studioClient', {value: null, configurable: true});

