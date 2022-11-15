import { DirPath, FilePath, Path, PathSegment } from "./file";
import { FileEventHandler, FileListener } from "../file-event-handler-2";
import { FileManagerNode } from "./file-manager-node";

export class FileManager<F> extends FileEventHandler<FileWithPath<F>, FilePath, F, F, F, F> {
    head: FileManagerNode<F> = new FileManagerNode();

    change: FileListener<F> = this.emitChange;

    add: FileListener<FileWithPath<F>> =
        (fileWithPath: FileWithPath<F>) => {
            const pathSegments = splitPath(fileWithPath.path);
            const filename = pathSegments.pop();

            if (filename === undefined) {
                return undefined;
            }

            this.head.createNodeAndDo(pathSegments, n => {
                if (!n.files.has(filename)) {
                    n.files.set(filename, fileWithPath.file);
                }
            });

            this.emitAdd(fileWithPath.file);
        };
    remove: FileListener<FilePath> =
        (path: FilePath) => {
            const pathSegments = splitPath(path);
            const filename = pathSegments.pop();

            if (filename === undefined) {
                return undefined;
            }

            const file = this.head.getNodeAndDo(pathSegments, n => {
                const file = n.files.get(filename);
                n.files.delete(filename);
                return file;
            });

            if (file !== undefined) {
                this.emitRemove(file);
            }

            return file;
        };
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
                n.untrackFiles(this.emitRemove);
            }
        });
    }
}

class FileWithPath<F> {
    file: F;
    path: FilePath;

    constructor(file: F, path: FilePath) {
        this.file = file;
        this.path = path;
    }
}

function splitPath(path: Path): PathSegment[] {
    return path.split("/");
}