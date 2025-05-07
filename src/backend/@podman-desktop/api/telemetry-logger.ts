import {Event, TelemetryTrustedValue} from '@podman-desktop/api';

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
