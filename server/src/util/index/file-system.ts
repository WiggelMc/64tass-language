import EventEmitter = require("events");
import { DirPath, File, FilePath, Path, PathSegment } from "./file";
import { FileSystemNode } from "./file-system-node";

const REMOVE_FILE_EVENT = Symbol('FileRemoved');

export class FileSystem {
    head: FileSystemNode = new FileSystemNode(this);
    eventEmitter: EventEmitter = new EventEmitter();

    addFile(path: FilePath, file: File): void {
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
    removeFile(path: FilePath): File | undefined {
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
    getFile(path: FilePath): File | undefined {
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

    getAllFiles(path: DirPath): File[] {
        const pathSegments = splitPath(path);

        return this.head.getNodeAndDo(pathSegments, n => {
            return []; //TODO implement
        }) ?? [];
    }

    trackDir(path: DirPath): void {
        this.head.trackDir(splitPath(path));
    }
    untrackDir(path: DirPath): void {
        this.head.untrackDir(splitPath(path));
    }

    onFileRemoved(listener: (file: File) => void): this {
        this.eventEmitter.on(REMOVE_FILE_EVENT, listener);
        return this;
    }
    offFileRemoved(listener: (file: File) => void): this {
        this.eventEmitter.off(REMOVE_FILE_EVENT, listener);
        return this;
    }
    emitFileRemoved(file: File): boolean {
        return this.eventEmitter.emit(REMOVE_FILE_EVENT, file);
    }
}

function splitPath(path: Path): PathSegment[] {
    return path.split("/");
}