import {Disposable, Event} from '@podman-desktop/api';

export class Emitter<T = unknown> {

  private _event: Event<T> | undefined;
  constructor() {}
  get event(): Event<T> {
    this._event ??= (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable => {
      // no-op
      return Disposable.create(() => {});
    }
    this._event['maxListeners'] = 0;
    return this._event;
  }
}
