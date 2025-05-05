import {vi} from 'vitest';
import {CancellationToken, Event, TelemetryTrustedValue} from "@podman-desktop/api";

export class CancellationTokenSource {
  public token: CancellationToken;
  constructor() {
    this.token = {
      isCancellationRequested: false,
      onCancellationRequested: vi.fn()
    };
  }
}

export class TelemetryLogger {
  public onDidChangeEnableStates: Event<TelemetryLogger>;
  public isUsageEnabled: boolean;
  public isErrorsEnabled: boolean;
  public logUsage: (eventName: string, data?: Record<string, any | TelemetryTrustedValue>) => void;
  public logError: (error: Error | string, data?: Record<string, any | TelemetryTrustedValue>) => void;
  public dispose: () => void;
  constructor() {
    this.isUsageEnabled = true;
    this.isErrorsEnabled = true;
    this.onDidChangeEnableStates = vi.fn();
    this.logUsage = vi.fn();
    this.logError = vi.fn();
    this.dispose = vi.fn();
  }
}

const api = {
  configuration: {
    mockedSections: {},
    getConfiguration: vi.fn(section => ({
      get: vi.fn(
        subsection => api.configuration.mockedSections[section]?.[subsection]
      )
    })),
    onDidChangeConfiguration: vi.fn()
  },
  provider: {
    getContainerConnections: vi.fn()
  },
  Uri: {
    joinPath: vi.fn((uri, ...paths) => ({fsPath: paths.join('/')}))
  }
};
export default api;
