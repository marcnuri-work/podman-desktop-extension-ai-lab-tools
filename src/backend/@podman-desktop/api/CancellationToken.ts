import {Emitter} from '@podman-desktop/api';

export class CancellationToken {
  private _isCancellationRequested: boolean;
  private emitter: Emitter<unknown> | undefined;

  constructor() {
    this._isCancellationRequested = false;
  }

  public cancel(): void {
    if (!this._isCancellationRequested) {
      this._isCancellationRequested = true;
      if (this.emitter) {
        this.emitter.fire(undefined);
        this.dispose();
      }
    }
  }

  get isCancellationRequested(): boolean {
    return this._isCancellationRequested;
  }

  get onCancellationRequested(): Event<unknown> {
    if (this._isCancellationRequested) {
      return shortcutEvent;
    }
    this.emitter ??= new Emitter<unknown>();
    return this.emitter.event;
  }

  public dispose(): void {
    if (this.emitter) {
      this.emitter.dispose();
      this.emitter = undefined;
    }
  }
}
