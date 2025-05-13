import { Disposable } from '@podman-desktop/api';

export class EventEmitter<T> {
  private listeners: ((e: T) => any)[] = [];
  public event = this.eventInternal.bind(this);

  private eventInternal(listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable {
    if (thisArgs) {
      listener = listener.bind(thisArgs);
    }
    this.listeners.push(listener);
    return Disposable.from(...(disposables ?? []));
  }

  fire(data: T): void {
    for (const listener of this.listeners) {
      try {
        listener(data);
      } catch (err) {
        console.error('Error in event listener', err);
      }
    }
  }

  dispose(): void {
    this.listeners.length = 0;
  }
}
