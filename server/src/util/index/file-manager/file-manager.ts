import { DirPath, FilePath, Path, PathSegment } from "./file";
import { FileEvent, FileEventHandler, FileListener } from "../file-event-handler";
import { FileManagerNode } from "./file-manager-node";

export class FileManager<F> extends FileEventHandler<F, F> {
    head: FileManagerNode<F> = new FileManagerNode();

    override getListener(event: FileEvent): FileListener<F> | undefined {
        switch (event) {
            case FileEvent.add:
            case FileEvent.remove:
            case FileEvent.change:
            default:
                return;
        }
    }

    changeFile(path: FilePath, file: F) {
        this.emit(FileEvent.change, file);
    }
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

        this.emit(FileEvent.add, file);
    }
    removeFile(path: FilePath): F | undefined {
        const pathSegments = splitPath(path);
        const filename = pathSegments.pop();

        if (filename === undefined) {
            return undefined;
        }

        const value = this.head.getNodeAndDo(pathSegments, n => {
            const file = n.files.get(filename);
            n.files.delete(filename);
            return file;
        });

        if (value !== undefined) {
            this.emit(FileEvent.remove, value);
        }
        
        return value;
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
                n.untrackFiles(this.getEmitter(FileEvent.remove));
            }
        });
    }
}

function splitPath(path: Path): PathSegment[] {
    return path.split("/");
}