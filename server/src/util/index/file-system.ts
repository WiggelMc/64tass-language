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

class FileSystemNode {
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

class File {
    //Might be removed in favour of Generic Parameter
}