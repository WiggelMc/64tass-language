import { DeleteFile } from "vscode-languageserver";

type Path = String;

class Index {
    folders: Map<Path, IndexFolder> = new Map();
    files: FileMap = new FileMap();

    addFile(path: Path) {
        const file = this.files.get(path) ?? new IndexFile(path, this.files);
        this.files.set(path, file);

        this.folders.forEach(f => f.addFile(path, file));
    }

    removeFile(path: Path) {

    }

    editFile(path: Path) {
        if (!this.files.has(path)) {
            this.addFile(path);
            return;
        }
        const file = this.files.get(path);
        //file.
    }

    addFolder(path: Path) {
        const folder = this.folders.get(path) ?? new IndexFolder(path);
        this.folders.set(path, folder);
        folder.startWatcher();
    }

    removeFolder(path: Path) {
        const folder = this.folders.get(path);
        folder?.delete();
    }
}

class IndexFolder {
    path: Path;
    files: Map<Path, IndexFile> = new Map();

    constructor(path: Path) {
        this.path = path;
    }

    addFile(path: Path, file: IndexFile) {
        if (this.path === path) {   //TODO: implement check
            this.files.set(path, file.reference(this));
        }
    }

    deleteFile(path: Path) {
        const file = this.files.get(path);
        file?.dereference(this);
        this.files.delete(path);
    }

    delete() {
        this.files.forEach(f => f.dereference(this));
    }

    startWatcher() {

    }
}

class IndexFile {
    path: Path;
    globalMap: FileMap;
    data: IndexFileData = new IndexFileData();
    references: Set<any> = new Set();

    constructor(path: Path, globalMap: FileMap) {
        this.path = path;
        this.globalMap = globalMap;
    }

    reference(obj: any): IndexFile {
        this.references.add(obj);
        return this;
    }

    dereference(obj: any): undefined {
        this.references.delete(obj);
        if (this.references.size === 0) {
            this.delete();
        }
        return undefined;
    }

    delete() {
        this.globalMap.delete(this.path);
    }
}

class IndexFileData {

}

class FileMap {

    map: Map<Path, IndexFile> = new Map();

    clear(): void {
        this.map.clear();
    }
    delete(key: Path): boolean {
        return this.map.delete(key);
    }
    forEach(callbackfn: (value: IndexFile, key: Path) => void, thisArg?: any): void {
        for (const [key, value] of this) {
            callbackfn(value, key);
        }
    }
    get(key: Path): IndexFile | undefined {
        return this.map.get(key);
    }
    has(key: Path): boolean {
        return this.map.has(key);
    }
    set(key: Path, value: IndexFile): this {
        this.map.set(key, value);
        return this;
    }
    entries(): IterableIterator<[Path, IndexFile]> {
        return this.map.entries();
    }
    keys(): IterableIterator<String> {
        return this.map.keys();
    }
    values(): IterableIterator<IndexFile> {
        return this.map.values();
    }
    [Symbol.iterator](): IterableIterator<[Path, IndexFile]> {
        return this.map[Symbol.iterator]();
    }
    get size() {
        return this.map.size;
    }
}