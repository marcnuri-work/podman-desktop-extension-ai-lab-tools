export interface Uri {
  readonly scheme: string;
  readonly authority: string;
  readonly path: string;
  readonly fsPath: string;
  readonly query: string;
  readonly fragment: string;

  with(change: { scheme?: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri;

  toString(): string;
}

export class UriImpl implements Uri {
  constructor(
    private _scheme: string,
    private _authority: string,
    private _path: string,
    private _query: string,
    private _fragment: string,
  ) {}

  static parse(value: string): Uri {
    const url = new URL(value);
    const search = url.search;
    let updatedSearch = '';
    if (search && search.length > 0) {
      // remove the ? character
      updatedSearch = search.substring(1);
    }
    return new UriImpl(
      url.protocol.substring(0, url.protocol.length - 1),
      url.host,
      url.pathname,
      updatedSearch,
      url.hash,
    );
  }

  static file(path: string): Uri {
    return new UriImpl('file', '', path, '', '');
  }

  with(change?: { scheme?: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri {
    if (!change) {
      return this;
    }

    let { scheme, authority, path, query, fragment } = change;
    scheme ??= this._scheme;
    authority ??= this._authority;
    path ??= this._path;
    query ??= this._query;
    fragment ??= this._fragment;

    if (
      scheme === this.scheme &&
      authority === this.authority &&
      path === this.path &&
      query === this.query &&
      fragment === this.fragment
    ) {
      return this;
    }

    return new UriImpl(scheme, authority, path, query, fragment);
  }

  get fsPath(): string {
    return this._path;
  }
  get scheme(): string {
    return this._scheme;
  }

  get authority(): string {
    return this._authority;
  }

  get path(): string {
    return this._path;
  }

  get query(): string {
    return this._query;
  }

  get fragment(): string {
    return this._fragment;
  }

  toString(): string {
    let link = `${this._scheme}://${this._authority}${this._path}`;
    if (this._query) {
      link = `${link}?${this._query}`;
    }
    if (this._fragment) {
      link = `${link}#${this._fragment}`;
    }
    return link;
  }
}
