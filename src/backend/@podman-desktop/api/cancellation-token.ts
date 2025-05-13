import { Disposable, Emitter, Event } from '@podman-desktop/api';

const shortcutEvent: Event<unknown> = Object.freeze((callback, context?): Disposable => {
  const handle = setTimeout(callback.bind(context), 0);
  return Disposable.create(() => {
    clearTimeout(handle);
  });
});

export class CancellationToken {
  private _isCancellationRequested: boolean;
  private emitter: Emitter | undefined;

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
