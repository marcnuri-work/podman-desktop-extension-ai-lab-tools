import {Disposable} from '@podman-desktop/api';

export class EventEmitter<T> {
  event(listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable {
    return Disposable.from(...(disposables ?? []));
  }
  fire(data: T): void {

  };
  dispose(): void {

  };
}
