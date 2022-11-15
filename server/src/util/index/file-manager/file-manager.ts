import { DirPath, FilePath, OnFileRemoved, Path, PathSegment } from "./file";
import { FileEventEmitter } from "../file-event-emitter";
import { FileManagerNode } from "./file-manager-node";

export class FileManager<F> extends FileEventEmitter<F> {
    head: FileManagerNode<F> = new FileManagerNode();

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
}

function splitPath(path: Path): PathSegment[] {
    return path.split("/");
}