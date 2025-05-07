import {CancellationToken} from '@podman-desktop/api';

export class CancellationTokenSource {

  private _token?: CancellationToken = undefined;

  get token(): CancellationToken {
    // be lazy and create the token only when actually needed
    this._token ??= new CancellationToken();
    return this._token;
  }

  cancel(): void {
    if (this._token) {
      this._token?.cancel();
    }
  }

  dispose(cancel = false): void {
    if (cancel) {
      this.cancel();
    }
    if (this._token) {
      this._token.dispose();
    }
  }
}
