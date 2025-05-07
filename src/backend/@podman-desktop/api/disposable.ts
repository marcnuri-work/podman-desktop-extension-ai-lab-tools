export class Disposable {

  private disposable?: undefined | (() => void);

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
    return new Disposable(func);
  }
  static from(...disposables: { dispose(): unknown }[]): Disposable {
    return new Disposable(() => {
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
