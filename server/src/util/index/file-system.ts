import EventEmitter = require("events");

type Path = FilePath | DirPath;
type FilePath = string;
type DirPath = string;

type PathSegment = FilePathSegment | DirPathSegment;
type FilePathSegment = string;
type DirPathSegment = string;

const REMOVE_FILE_EVENT = Symbol('FileRemoved');

class FileSystem {
    head: FileSystemNode = new FileSystemNode(this);
    eventEmitter: EventEmitter = new EventEmitter();

    addFile(path: FilePath, file: File): void {
        this.head.addFile(splitPath(path), file);
    }
    removeFile(path: FilePath): File | undefined {
        return this.head.removeFile(splitPath(path));
    }
    getFile(path: FilePath): File | undefined {
        return this.head.getFile(splitPath(path));
    }
    hasFile(path: FilePath): boolean {
        return this.getFile(path) !== undefined;
    }

    getAllFiles(path: DirPath): File[] {
        return this.head.getAllFiles(splitPath(path));
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

class FileSystemNode {
    files: Map<string, File> = new Map();
    children: Map<string, FileSystemNode> = new Map();
    isTracked: boolean = false;
    fileSystem: FileSystem;

    constructor(fileSystem: FileSystem) {
        this.fileSystem = fileSystem;
    }

    addFile(pathSegments: FilePathSegment[], file: File): void {
        const segment = pathSegments.shift();

        if (segment === undefined) {
            return;
        }

        if (pathSegments.length > 0) {
            const nextNode = this.createNextNode(segment);
            nextNode.addFile(pathSegments, file);
        } else {
            if (!this.files.has(segment)) {
                this.files.set(segment, file);
            }
        }
    }
    removeFile(pathSegments: FilePathSegment[]): File | undefined {
        const segment = pathSegments.shift();

        if (segment === undefined) {
            return undefined;
        }

        if (pathSegments.length > 0) {
            const nextNode = this.children.get(segment);
            if (nextNode?.isEmpty()) {
                this.children.delete(segment);
            }
            return nextNode?.removeFile(pathSegments);
        } else {
            const file = this.files.get(segment);
            this.files.delete(segment);
            return file;
        }
    }
    getFile(pathSegments: FilePathSegment[]): File | undefined {
        const segment = pathSegments.shift();

        if (segment === undefined) {
            return undefined;
        }

        if (pathSegments.length > 0) {
            return this.children.get(segment)?.getFile(pathSegments);
        } else {
            return this.files.get(segment);
        }
    }

    getAllFiles(pathSegments: FilePathSegment[]): File[] {
        return []; //TODO implement
    }

    trackDir(pathSegments: DirPathSegment[]) {
        const segment = pathSegments.shift();

        if (segment === undefined) {
            this.isTracked = true;
        } else {
            const nextNode = this.createNextNode(segment);
            nextNode.trackDir(pathSegments);
        }
    }
    untrackDir(pathSegments: DirPathSegment[], isTracked = false) {
        const segment = pathSegments.shift();

        if (segment === undefined) {
            this.isTracked = false;
            if (!isTracked) {
                this.untrackFiles();
            }
        } else {
            const nextNode = this.createNextNode(segment);
            nextNode.untrackDir(pathSegments, isTracked || this.isTracked);
        }
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

    getNodeAndDo<R>(pathSegments: DirPathSegment[], f: (node: FileSystemNode) => R): R | undefined {
        const segment = pathSegments.shift();
        
        if (segment === undefined) {
            return f(this);
        }

        const nextNode = this.children.get(segment);
        const value = nextNode?.getNodeAndDo(pathSegments, f);
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
        nextNode.createNodeAndDo(pathSegments, f);
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

class File {
    //Might be removed in favour of Generic Parameter
}