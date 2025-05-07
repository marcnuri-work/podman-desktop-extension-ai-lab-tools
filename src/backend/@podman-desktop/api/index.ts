import * as nodeFs from 'node:fs';
import * as nodeProcess from 'node:process';
export {CancellationToken} from './cancellation-token';
export {CancellationTokenSource} from './cancellation-token-source';
export {Disposable} from './disposable';
export {Emitter} from './emitter';
export {EventEmitter} from './event-emitter';
export {TelemetryLogger} from './telemetry-logger';
export {TelemetryTrustedValue} from './telemetry-trusted-value';

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

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}
export interface Webview {
  postMessage(message: unknown): Promise<boolean>;
}
