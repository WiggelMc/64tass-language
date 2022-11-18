import { DocumentIndexManagerMessages } from "../document-index-manager/file-index-manager";
import { DirPath, FilePath, FileWithPath, splitPath } from "../file";
import { FileListener, FileEventEmitter, FileEventListener } from "../file-event-handler";
import { FileManagerNode } from "./file-manager-node";

export interface FileManagerMessages<F> {
    add: FileWithPath<F>
    remove: FilePath
    change: F
    trackDir: DirPath
    untrackDir: DirPath
}

export class FileManager<F> extends FileEventEmitter<DocumentIndexManagerMessages<F>> implements FileEventListener<FileManagerMessages<F>> {
    head: FileManagerNode<F> = new FileManagerNode();

    change: FileListener<F> = f => this.emit("change", f);

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
                    this.emit("add", fileWithPath.file);
                }
            });
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
                this.emit("remove", file);
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
                n.untrackFiles(f => this.emit("remove", f));
            }
        });
    }
}