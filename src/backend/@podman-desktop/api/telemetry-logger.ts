import {Event, TelemetryTrustedValue} from '@podman-desktop/api';


export interface TelemetryLogger {
  readonly onDidChangeEnableStates: Event<TelemetryLogger>;
  readonly isUsageEnabled: boolean;
  readonly isErrorsEnabled: boolean;
  logUsage(eventName: string, data?: Record<string, any | TelemetryTrustedValue>): void;
  logError(eventName: string, data?: Record<string, any | TelemetryTrustedValue>): void;
  logError(error: Error, data?: Record<string, any | TelemetryTrustedValue>): void;
  dispose(): void;
}

export class NoOpTelemetryLogger implements TelemetryLogger {
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
