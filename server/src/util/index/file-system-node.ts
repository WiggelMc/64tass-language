import { DirPathSegment, File } from "./file";
import { FileSystem } from "./file-system";

export class FileSystemNode {
    files: Map<string, File> = new Map();
    children: Map<string, FileSystemNode> = new Map();
    isTracked: boolean = false;
    fileSystem: FileSystem;

    constructor(fileSystem: FileSystem) {
        this.fileSystem = fileSystem;
    }

    trackDir(pathSegments: DirPathSegment[]) {
        this.createNodeAndDo(pathSegments, n => {
            n.isTracked = true;
        });
    }
    untrackDir(pathSegments: DirPathSegment[]) {
        this.getNodeAndDo(pathSegments, (n, t) => {
            n.isTracked = false;
            if (!t) {
                n.untrackFiles();
            }
        });
    }

    untrackFiles() {
        if (this.isTracked) {
            return;
        }

        for (const [segment, file] of this.files) {
            this.fileSystem.emitFileRemoved(file);
        }
        this.files.clear();

        for (const [segment, child] of this.children) {
            child.untrackFiles();
            if (child.isEmpty()) {
                this.children.delete(segment);
            }
        }
    }
    isEmpty(): boolean {
        return (
            !this.isTracked 
            && this.children.size === 0 
            && this.files.size === 0
        );
    }

    getNodeAndDo<R>(pathSegments: DirPathSegment[], f: (node: FileSystemNode, isTracked: boolean) => R, isTracked = false): R | undefined {
        const segment = pathSegments.shift();
        
        if (segment === undefined) {
            return f(this, isTracked);
        }

        const nextNode = this.children.get(segment);
        const value = nextNode?.getNodeAndDo(pathSegments, f, isTracked || this.isTracked);
        if (nextNode?.isEmpty()) {
            this.children.delete(segment);
        }
        return value;
    }
    createNodeAndDo<R>(pathSegments: DirPathSegment[], f: (node: FileSystemNode) => R): R {
        const segment = pathSegments.shift();

        if (segment === undefined) {
            return f(this);
        }

        const nextNode = this.createNextNode(segment);
        return nextNode.createNodeAndDo(pathSegments, f);
    }

    createNextNode(segment: string): FileSystemNode {
        let nextNode = this.children.get(segment);

        if (nextNode === undefined) {
            nextNode = new FileSystemNode(this.fileSystem);
            this.children.set(segment, nextNode);
        }

        return nextNode;
    }
}