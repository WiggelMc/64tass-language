import { Emitter } from "../file-event-handler";
import { DirPathSegment } from "../file";

export class FileManagerNode<F> {
    files: Map<string, F> = new Map();
    children: Map<string, FileManagerNode<F>> = new Map();
    isTracked: boolean = false;

    isEmpty(): boolean {
        return (
            !this.isTracked
            && this.children.size === 0
            && this.files.size === 0
        );
    }
    createNextNode(segment: string): FileManagerNode<F> {
        let nextNode = this.children.get(segment);

        if (nextNode === undefined) {
            nextNode = new FileManagerNode();
            this.children.set(segment, nextNode);
        }

        return nextNode;
    }

    untrackFiles(emitFileRemoved: Emitter<F>) {
        if (this.isTracked) {
            return;
        }

        for (const file of this.files.values()) {
            emitFileRemoved(file);
        }
        this.files.clear();

        for (const [segment, child] of this.children) {
            child.untrackFiles(emitFileRemoved);
            if (child.isEmpty()) {
                this.children.delete(segment);
            }
        }
    }
    getNodeAndDo<R>(pathSegments: DirPathSegment[], f: (node: FileManagerNode<F>, isTracked: boolean) => R, isTracked = false): R | undefined {
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
    createNodeAndDo<R>(pathSegments: DirPathSegment[], f: (node: FileManagerNode<F>) => R): R {
        const segment = pathSegments.shift();

        if (segment === undefined) {
            return f(this);
        }

        const nextNode = this.createNextNode(segment);
        return nextNode.createNodeAndDo(pathSegments, f);
    }
}