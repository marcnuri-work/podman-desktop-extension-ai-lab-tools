import { Disposable, Event } from '@podman-desktop/api';

export class Emitter<T = unknown> {
  private readonly _callbacks: { listener: (e: T) => any; thisArgs?: any }[];
  private _event: Event<T> | undefined;

  constructor() {
    this._callbacks = [];
  }

  get event(): Event<T> {
    this._event ??= (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable => {
      this._callbacks.push({ listener, thisArgs });
      return Disposable.create(() => {});
    };
    this._event['maxListeners'] = 0;
    return this._event;
  }

  fire(event: T): void {
    for (const callback of this._callbacks) {
      try {
        callback.listener.bind(callback.thisArgs)(event);
      } catch (e) {
        console.error('Error in event listener', e);
      }
    }
  }

  dispose(): void {
    this._event = undefined;
    this._callbacks.length = 0;
  }
}
