import * as nodeFs from 'node:fs';
import * as nodeProcess from 'node:process';
export {CancellationToken} from './cancellation-token';
export {CancellationTokenSource} from './cancellation-token-source';
export {type Disposable, SimpleDisposable} from './disposable';
export {Emitter} from './emitter';
export type {Event} from './event';
export {EventEmitter} from './event-emitter';
export {NoOpTelemetryLogger, type TelemetryLogger} from './telemetry-logger';
export {TelemetryTrustedValue} from './telemetry-trusted-value';
export type {Uri} from './uri';
export type {Webview} from './webview';
export type {WebviewOptions} from './webview-options';

export const configuration = {};
export const containerEngine = {
  async listContainers(): Promise<[]> {
    return [];
  }
};
export const env = {};
export const extensions = {};
export const fs = nodeFs;
export const navigation = {};
export const process = nodeProcess;
export const provider = {
  onDidRegisterContainerConnection: () => {},
  onDidUnregisterContainerConnection: () => {},
  onDidUpdateContainerConnection: () => {},
  onDidUpdateProvider: () => {},
  getContainerConnections: () => {
    return [{
      providerId: 'podman',
      connection: {
        name: 'podman',
        displayName: 'Podman',
        type: 'podman',
        status: () => 'started'
      }
    }];
  }
};
export const window = {};

