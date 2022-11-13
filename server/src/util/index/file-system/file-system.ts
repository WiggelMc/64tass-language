import EventEmitter = require("events");
import { DirPath, FilePath, OnFileRemoved, Path, PathSegment } from "./file";
import { FileSystemNode } from "./file-system-node";

const REMOVE_FILE_EVENT = Symbol('FileRemoved');

export class FileSystem<F> {
    head: FileSystemNode<F> = new FileSystemNode();
    eventEmitter: EventEmitter = new EventEmitter();

    addFile(path: FilePath, file: F): void {
        const pathSegments = splitPath(path);
        const filename = pathSegments.pop();

        if (filename === undefined) {
            return undefined;
        }

        this.head.createNodeAndDo(pathSegments, n => {
            if (!n.files.has(filename)) {
                n.files.set(filename, file);
            }
        });
    }
    removeFile(path: FilePath): F | undefined {
        const pathSegments = splitPath(path);
        const filename = pathSegments.pop();

        if (filename === undefined) {
            return undefined;
        }

        return this.head.getNodeAndDo(pathSegments, n => {
            const file = n.files.get(filename);
            n.files.delete(filename);
            return file;
        });
    }
    getFile(path: FilePath): F | undefined {
        const pathSegments = splitPath(path);
        const filename = pathSegments.pop();

        if (filename === undefined) {
            return undefined;
        }

        return this.head.getNodeAndDo(pathSegments, n => {
            return n.files.get(filename);
        });
    }
    hasFile(path: FilePath): boolean {
        return this.getFile(path) !== undefined;
    }

    trackDir(path: DirPath): void {
        const pathSegments = splitPath(path);
        
        this.head.createNodeAndDo(pathSegments, n => {
            n.isTracked = true;
        });
    }
    untrackDir(path: DirPath): void {
        const pathSegments = splitPath(path);

        this.head.getNodeAndDo(pathSegments, (n, t) => {
            n.isTracked = false;
            if (!t) {
                n.untrackFiles(this.emitFileRemoved);
            }
        });
    }

    onFileRemoved(listener: OnFileRemoved<F>): this {
        this.eventEmitter.on(REMOVE_FILE_EVENT, listener);
        return this;
    }
    offFileRemoved(listener: OnFileRemoved<F>): this {
        this.eventEmitter.off(REMOVE_FILE_EVENT, listener);
        return this;
    }
    emitFileRemoved(file: F): boolean {
        return this.eventEmitter.emit(REMOVE_FILE_EVENT, file);
    }
}

function splitPath(path: Path): PathSegment[] {
    return path.split("/");
}