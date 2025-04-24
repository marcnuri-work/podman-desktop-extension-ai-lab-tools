import {vi} from 'vitest';

export class CancellationTokenSource {
  constructor() {
    this.token = {
      onCancellationRequested: vi.fn()
    };
  }
}

export class TelemetryLogger {
  constructor() {
    this.log = vi.fn();
    this.logError = vi.fn();
    this.logWarning = vi.fn();
    this.logInfo = vi.fn();
    this.logUsage = vi.fn();
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
