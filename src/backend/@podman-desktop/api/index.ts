import * as nodeFs from 'node:fs';
import * as nodeProcess from 'node:process';
export {CancellationToken} from './CancellationToken';
export {CancellationTokenSource} from './CancellationTokenSource';
export {Disposable} from './Disposable';
export {Emitter} from './Emitter';
export {TelemetryLogger} from './TelemetryLogger';

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
export class EventEmitter<T> {
  event(listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable {
    return Disposable.from(...(disposables ?? []));
  }
  fire(data: T): void {

  };
  dispose(): void {

  };
}

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}
export interface Webview {
  postMessage(message: unknown): Promise<boolean>;
}

export class TelemetryTrustedValue<T = any> {
  constructor(public readonly value: T) {}
}
