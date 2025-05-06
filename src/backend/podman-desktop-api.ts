import * as nodeFs from 'node:fs';
import * as nodeProcess from 'node:process';

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
export class Disposable {
  private disposable: undefined | (() => void);
  constructor(func: () => void){
    this.disposable = func;
  }
  dispose(): void {
    if (this.disposable) {
      this.disposable();
      this.disposable = undefined;
    }
  }

  static create(func: () => void): Disposable {
    return new Disposable(func);
  }
  static from(...disposables: { dispose(): unknown }[]): Disposable {
    return new Disposable(() => {
      if (disposables) {
        for (const disposable of disposables) {
          if (disposable && typeof disposable.dispose === 'function') {
            disposable.dispose();
          }
        }
      }
    });
  }
}
export class EventEmitter<T> {
  event(listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable {
    return Disposable.from(...(disposables ?? []));
  }
  fire(data: T): void {

  };
  dispose(): void {

  };
}
export interface Webview {
  postMessage(message: unknown): Promise<boolean>;
}

export class TelemetryTrustedValue<T = any> {
  constructor(public readonly value: T) {}
}
export class TelemetryLogger {
  public onDidChangeEnableStates: Event<TelemetryLogger>;
  public isUsageEnabled: boolean;
  public isErrorsEnabled: boolean;
  constructor() {
    this.isUsageEnabled = true;
    this.isErrorsEnabled = true;
  }
  public logUsage(eventName: string, data?: Record<string, any | TelemetryTrustedValue>): void {}
  public logError(error: Error | string, data?: Record<string, any | TelemetryTrustedValue>): void {}
  public dispose(): void {}
}
