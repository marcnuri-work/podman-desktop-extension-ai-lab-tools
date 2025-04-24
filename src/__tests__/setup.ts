import {beforeEach, vi} from 'vitest';
import {InferenceManager} from 'podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager';
import {RpcExtension} from '@shared/messages/MessageProxy';

vi.mock('podman-desktop-extension-ai-lab-backend/src/managers/inference/inferenceManager');
vi.mock('@shared/messages/MessageProxy');

beforeEach(() => {
    vi.mocked(RpcExtension).mockImplementation(() => ({
        fire: vi.fn().mockResolvedValue(true),
        on: vi.fn(),
        send: vi.fn(),
    } as unknown as RpcExtension));
    vi.mocked(InferenceManager).mockImplementation(() => ({
        get: vi.fn(),
        getServers: vi.fn(),
        createInferenceServer: vi.fn(),
        startInferenceServer: vi.fn(),
    } as unknown as InferenceManager));
})
