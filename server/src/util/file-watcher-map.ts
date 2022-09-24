import * as chokidar from "chokidar";
import * as fs from "fs";

export type ChokidarEvent = 'add'|'addDir'|'change'|'unlink'|'unlinkDir';

export class ConditionalFileWatcher {
    watcher?: chokidar.FSWatcher;
    path: string;
    listener: (eventName: 'add'|'addDir'|'change'|'unlink'|'unlinkDir', path: string, stats?: fs.Stats) => void;

    constructor(path: string, listener: (eventName: 'add'|'addDir'|'change'|'unlink'|'unlinkDir', path: string, stats?: fs.Stats) => void) {
        this.path = path;
        this.listener = listener;
    }

    enable() {
        if (this.watcher !== undefined) {
            return;
        }

        const watcher = chokidar.watch(this.path, {ignoreInitial: true}).on('all', this.listener);
        this.watcher = watcher;
    }

    enableInitial() {
        if (this.watcher !== undefined) {
            return;
        }

        const watcher = chokidar.watch(this.path).on('all', this.listener);
        this.watcher = watcher;
    }

    disable() {
        if (this.watcher === undefined) {
            return;
        }

        this.watcher.unwatch(this.path).close();
        this.watcher = undefined;
    }

    removeDirs(children: string[]) {
        if (this.watcher === undefined) {
            return;
        }

        console.log("Removed: %s \nChildren: %s", this.path, children); // use this to remove files from index

        const event: ChokidarEvent = 'unlink';
        // this.listener(event, this.path); //use children and indexed files to determine what to unlink (every indexed file not in children)
    }
}

export class FileWatcherMap {
    rootNode: FileWatcherMapNode;

    constructor() {
        this.rootNode = new FileWatcherMapNode();
    }

    get(path: string): ConditionalFileWatcher | undefined {
        return this.rootNode.get(FileWatcherMap.splitPath(path));
    }

    add(path: string, value: ConditionalFileWatcher): void{
        this.rootNode.add(FileWatcherMap.splitPath(path), value);
    }

    remove(path: string): void {
        this.rootNode.remove(FileWatcherMap.splitPath(path));
    }

    toString() {
        let str = "FileWatcherMap:\n\n";
        this.rootNode.forAllChildren(c => str += (c.path + " | " + (c.watcher !== undefined) + "\n"));
        return str;
    }

    static splitPath(path: string): string[] {
        return path.split("\\");
    }
}

export class FileWatcherMapNode {
    value?: ConditionalFileWatcher;
    children: Map<string, FileWatcherMapNode> = new Map();

    get(path: string[]): ConditionalFileWatcher | undefined {
        if(path.length === 0) {
            return this.value;
        }

        return this.children.get(path[0])?.get(path.slice(1));
    }

    add(path: string[], value: ConditionalFileWatcher, parentSeen: boolean = false): void {
        if(path.length <= 0) {
            if (this.value === undefined) {

                this.value = value;

                this.onAdded(value, !parentSeen);
                if (!parentSeen) {
                    this.onBecomeParent(value);
                    this.forAllFirstChildren(this.onRevokeParent);
                }
            }
            return;
        }

        let next = this.children.get(path[0]);

        if (next === undefined) {
            next = new FileWatcherMapNode();
            this.children.set(path[0], next);
        }

        next.add(path.slice(1), value, parentSeen || this.value !== undefined);
    }

    remove(path: string[], parentSeen: boolean = false): void {
        if(path.length <= 0) {

            const value = this.value;
            this.value = undefined;

            if (value !== undefined) {
                this.onRemoved(value, !parentSeen);
                if (!parentSeen) {
                    this.onRevokeParent(value);
                    this.forAllFirstChildren(this.onBecomeParent);
                }
            }
            return;
        }

        let next = this.children.get(path[0]);
        next?.remove(path.slice(1), parentSeen || this.value !== undefined);

        if (next?.isEmpty()) {
            this.children.delete(path[0]);
        }
    }

    forAllFirstChildren(f: (value: ConditionalFileWatcher) => void) {
        for (const [path, node] of this.children) {

            if (node.value === undefined) {
                node.forAllFirstChildren(f);
            } else {
                f(node.value);
            }
        }
    }

    forAllChildren(f: (value: ConditionalFileWatcher) => void) {
        for (const [path, node] of this.children) {

            if (node.value !== undefined) {
                f(node.value);
            }
            node.forAllChildren(f);
        }
    }

    isEmpty(): boolean {
        return (this.children.size <= 0 && this.value === undefined);
    }

    onBecomeParent(value: ConditionalFileWatcher): void {
        value.enable();
    }

    onRevokeParent(value: ConditionalFileWatcher): void {
        value.disable();
    }
    onAdded(value: ConditionalFileWatcher, isParent: boolean): void {
        if (isParent) {
            value.enableInitial();
        }
    };
    onRemoved(value: ConditionalFileWatcher, isParent: boolean): void {
        if (isParent) {
            const children: string[] = [];
            this.forAllFirstChildren(c => children.push(c.path));
            value.removeDirs(children);
        }
    };
}