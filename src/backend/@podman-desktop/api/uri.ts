export interface Uri {

  readonly scheme: string;
  readonly authority: string;
  readonly path: string;
  readonly fsPath: string;
  readonly query: string;
  readonly fragment: string;

  with(change: {
    scheme?: string;
    authority?: string;
    path?: string;
    query?: string;
    fragment?: string;
  }): Uri;

  toString(): string;
}
