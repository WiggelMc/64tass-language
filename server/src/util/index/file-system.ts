
type Path = FilePath | DirPath;
type FilePath = string;
type DirPath = string;

type PathSegment = FilePathSegment | DirPathSegment;
type FilePathSegment = string;
type DirPathSegment = string;

class FileSystem {
    head: FileSystemNode = new FileSystemNode();

    addFile(path: FilePath, file: File): void {
        const segments = path.split("/");
        this.head.addFile(segments, file);
    }

    removeFile(path: FilePath): File | undefined {
        const segments = path.split("/");
        return this.head.removeFile(segments);
    }

    getFile(path: FilePath): File | undefined {
        const segments = path.split("/");
        return this.head.getFile(segments);
    }

    hasFile(path: FilePath): boolean {
        return this.getFile(path) !== undefined;
    }

    trackDir(path: DirPath) {
        const segments = path.split("/");
        this.head.trackDir(segments);
    }
    untrackDir() {

    }
}

class FileSystemNode {
    files: Map<string, File> = new Map();
    children: Map<string, FileSystemNode> = new Map();
    isTracked: boolean = false;

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

    addFile(pathSegments: FilePathSegment[], file: File): void {
        const segment = pathSegments.shift();

        if (segment === undefined) {
            return;
        }

        if (pathSegments.length > 0) {
            const nextNode = this.getOrCreateNode(segment);
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

    trackDir(pathSegments: DirPathSegment[], isTracked = false) {
        const segment = pathSegments.shift();
        isTracked ||= this.isTracked;

        if (segment === undefined) {
            this.isTracked = true;
            if (!isTracked) {
                //load files (do we need this?)
            }
        } else {
            const nextNode = this.getOrCreateNode(segment);
            nextNode.trackDir(pathSegments, isTracked);
        }
    }

    untrackDir(pathSegments: DirPathSegment[], isTracked = false) {
        const segment = pathSegments.shift();
        isTracked ||= this.isTracked;

        if (segment === undefined) {
            this.isTracked = false;
            if (isTracked) {
                this.untrackFiles();
            }
        } else {
            const nextNode = this.getOrCreateNode(segment);
            nextNode.untrackDir(pathSegments, isTracked);
        }
    }

    untrackFiles() {
        if (this.isTracked) {
            return;
        }

        for (const [segment, file] of this.files) {
            //fire RemoveFileEvent
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

    getOrCreateNode(segment: string) {
        let nextNode = this.children.get(segment);

        if (nextNode === undefined) {
            nextNode = new FileSystemNode();
            this.children.set(segment, nextNode);
        }

        return nextNode;
    }
}

class File {

}