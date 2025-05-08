import * as nodeFs from 'node:fs';
import {type Disposable, Emitter, type Event, type Uri, UriImpl, disposables} from '@podman-desktop/api';


const createFileSystemWatcher: (path: string) => FileSystemWatcher = path => {
  const fsw = new FileSystemWatcher(path);
  disposables.push(fsw);
  return fsw;
};

export class FileSystemWatcher implements Disposable {

  private readonly _onDidChange: Emitter<Uri>;
  private readonly _onDidCreate: Emitter<Uri>;
  private readonly _onDidDelete: Emitter<Uri>;
  public readonly onDidChange: Event<Uri>;
  public readonly onDidCreate: Event<Uri>;
  public readonly onDidDelete: Event<Uri>;
  private readonly fsWatcher: nodeFs.FSWatcher;


  constructor(
    private readonly path: string,
  ) {
    this._onDidChange = new Emitter<Uri>();
    this._onDidCreate = new Emitter<Uri>();
    this._onDidDelete = new Emitter<Uri>();
    this.onDidChange = this._onDidChange.event;
    this.onDidCreate = this._onDidCreate.event;
    this.onDidDelete = this._onDidDelete.event;
    this.fsWatcher = nodeFs.watch(path, (eventType: string, _filename: string) => {
      const uri: Uri = UriImpl.file(this.path);
      if (eventType === 'rename') {
        if (nodeFs.existsSync(this.path)) {
          this._onDidCreate.fire(uri);
        } else {
          this._onDidDelete.fire(uri);
        }
      } else if (eventType === 'change') {
        this._onDidChange.fire(uri);
      }
    });
  }

  dispose(): void {
    this.fsWatcher.close();
    this._onDidChange.dispose();
    this._onDidCreate.dispose();
    this._onDidDelete.dispose();
  }
}

export const fs = {
  createFileSystemWatcher,
};
