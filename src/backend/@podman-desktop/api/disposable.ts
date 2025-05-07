export interface Disposable {
  dispose(): void;
}

export class SimpleDisposable {
  private disposable: undefined | (() => void);
  constructor(func: () => void){
    this.disposable = func;
  }
  dispose(): void {
    if (this.disposable) {
      this.disposable();
      this.disposable = undefined;
    }
  }

  static create(func: () => void): Disposable {
    return new SimpleDisposable(func);
  }
  static from(...disposables: { dispose(): unknown }[]): Disposable {
    return new SimpleDisposable(() => {
      if (disposables) {
        for (const disposable of disposables) {
          if (disposable && typeof disposable.dispose === 'function') {
            disposable.dispose();
          }
        }
      }
    });
  }
}
