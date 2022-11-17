import { DirPath, FilePath, FileWithPath, Path, PathSegment, splitPath } from "../file";
import { SingleInputFileEventHandler, FileListener } from "../file-event-handler";
import { FileManagerNode } from "./file-manager-node";

export class FileManager<F> extends SingleInputFileEventHandler<FileWithPath<F>, FilePath, F, F, F, F> {
    head: FileManagerNode<F> = new FileManagerNode();

    change: FileListener<F> = this.emitChange;

    add: FileListener<FileWithPath<F>> =
        (fileWithPath) => {
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
        (path) => {
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