import * as nodeProcess from 'node:process';
import { Disposable as DisposableImpl } from './disposable';
export { CancellationToken } from './cancellation-token';
export { CancellationTokenSource } from './cancellation-token-source';
export { Disposable } from './disposable';
export { Emitter } from './emitter';
export type { Event } from './event';
export { EventEmitter } from './event-emitter';
export { fs } from './fs';
export { NoOpTelemetryLogger, type TelemetryLogger } from './telemetry-logger';
export { TelemetryTrustedValue } from './telemetry-trusted-value';
export { type Uri, UriImpl } from './uri';
export { StandaloneWebview, type Webview } from './webview';
export type { WebviewOptions } from './webview-options';

export const disposables: DisposableImpl[] = [];

export const configuration = {};
export const containerEngine = {
  async listContainers(): Promise<[]> {
    return [];
  },
};
export const env = {};
export const extensions = {};
export const navigation = {};
export const process = nodeProcess;
export const provider = {
  onDidRegisterContainerConnection: () => {},
  onDidUnregisterContainerConnection: () => {},
  onDidUpdateContainerConnection: () => {},
  onDidUpdateProvider: () => {},
  getContainerConnections: () => {
    return [
      {
        providerId: 'podman',
        connection: {
          name: 'podman',
          displayName: 'Podman',
          type: 'podman',
          status: () => 'started',
        },
      },
    ];
  },
};
export const window = {};
