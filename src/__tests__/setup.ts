import { beforeEach, vi } from 'vitest';
import { InferenceManager } from 'podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager';

vi.mock('podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager');

beforeEach(() => {
  vi.mocked(InferenceManager).mockImplementation(
    () =>
      ({
        get: vi.fn(),
        getServers: vi.fn(),
        createInferenceServer: vi.fn(),
        startInferenceServer: vi.fn(),
      }) as unknown as InferenceManager,
  );
});
