import {type Disposable, Event, SimpleDisposable} from '@podman-desktop/api';

export class Emitter<T = unknown> {

  private _event: Event<T> | undefined;
  constructor() {}
  get event(): Event<T> {
    this._event ??= (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable => {
      // no-op
      return SimpleDisposable.create(() => {});
    }
    this._event['maxListeners'] = 0;
    return this._event;
  }

  fire(event: T): void {
  }

  dispose(): void {
  }
}
