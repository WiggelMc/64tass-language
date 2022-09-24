// export class PathLayerMap<T, N extends PathLayerMapNode<T>> {
//     rootNode: N;

//     constructor(node: N) {
//         this.rootNode = node;
//     }

//     get(path: string): T | undefined {
//         return this.rootNode.get(PathLayerMap.splitPath(path));
//     }

//     add(path: string, value: T): void{
//         this.rootNode.add(PathLayerMap.splitPath(path), value);
//     }

//     remove(path: string): void {
//         this.rootNode.remove(PathLayerMap.splitPath(path));
//     }

//     static splitPath(path: string): string[] {
//         return path.split("\\");
//     }
// }

// export interface PathLayerMapNode<T> {
//     new (): PathLayerMapNode<T>;

//     get(path: string[]): T | undefined;
//     add(path: string[], value: T, parentSeen: boolean): void;
//     remove(path: string[], parentSeen: boolean): void;

//     isEmpty(): boolean;

//     forAllChildren(f: (value: T) => void): void;

//     onBecomeParent(value: T): void;
//     onRevokeParent(value: T): void;
//     onAdded(value: T): void;
//     onRemoved(value: T): void;
// }

// export class PathLayerMapNode<T> {
//     private value?: T;
//     private children: Map<string, PathLayerMapNode<T>> = new Map();

//     get(path: string[]): T | undefined {
//         if(path.length === 0) {
//             return this.value;
//         }

//         return this.children.get(path[0])?.get(path.slice(1));
//     }

//     add(path: string[], value: T, parentSeen: boolean = false): void {
//         if(path.length <= 0) {
//             if (this.value === undefined) {

//                 this.value = value;

//                 this.onAdded(value);
//                 if (parentSeen) {
//                     this.forAllChildren(this.onRevokeParent);
//                 } else {
//                     this.onBecomeParent(value);
//                 }
//             }
//             return;
//         }

//         let next = this.children.get(path[0]);

//         if (next === undefined) {
//             next = <PathLayerMapNode<T>>Object.create(this);
//             this.children.set(path[0], next);
//         }

//         next.add(path.slice(1), value, parentSeen || this.value !== undefined);
//     }

//     remove(path: string[], parentSeen: boolean = false): void {
//         if(path.length <= 0) {

//             const value = this.value;
//             this.value = undefined;

//             if (value !== undefined) {
//                 this.onRemoved(value);
//                 if (parentSeen) {
//                     this.onRevokeParent(value);
//                 } else {
//                     this.forAllChildren(this.onBecomeParent);
//                 }
//             }
//             return;
//         }

//         let next = this.children.get(path[0]);
//         next?.remove(path.slice(1), parentSeen || this.value !== undefined);

//         if (next?.isEmpty()) {
//             this.children.delete(path[0]);
//         }
//     }

//     forAllChildren(f: (value: T) => void) {
//         for (const [path, node] of this.children) {

//             if (node.value === undefined) {
//                 node.forAllChildren(f);
//             } else {
//                 f(node.value);
//             }
//         }
//     }

//     isEmpty(): boolean {
//         return (this.children.size <= 0 && this.value === undefined);
//     }

//     onBecomeParent(value: T): void {};
//     onRevokeParent(value: T): void {};
//     onAdded(value: T): void {};
//     onRemoved(value: T): void {};
// }