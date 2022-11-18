import { EventEmitter } from "events";
import { Interface } from "readline";

export enum FileEvent {
    add = 'AddFile',
    remove = 'RemoveFile',
    change = 'ChangeFile',
}

export type FileEmitter<F> = (file: F) => boolean;
export type FileListener<F> = (file: F) => void;

export class FileEventHandler<EA, ER, EC> {
    eventEmitter: EventEmitter = new EventEmitter();

    register<I extends FileEventHandlerInput<EA, ER, EC>>(next: I): I {

        this.onAdd(next.add);
        this.onRemove(next.remove);
        this.onChange(next.change);

        return next;
    }

    onAdd = (f: FileListener<EA>) => this.on(FileEvent.add, f);
    onRemove = (f: FileListener<ER>) => this.on(FileEvent.remove, f);
    onChange = (f: FileListener<EC>) => this.on(FileEvent.change, f);

    offAdd = (f: FileListener<EA>) => this.off(FileEvent.add, f);
    offRemove = (f: FileListener<ER>) => this.off(FileEvent.remove, f);
    offChange = (f: FileListener<EC>) => this.off(FileEvent.change, f);

    emitAdd: FileEmitter<EA> = f => this.emit(FileEvent.add, f);
    emitRemove: FileEmitter<ER> = f => this.emit(FileEvent.remove, f);
    emitChange: FileEmitter<EC> = f => this.emit(FileEvent.change, f);

    on<E>(event: FileEvent, listener: FileListener<E>): this {
        this.eventEmitter.on(event, listener);
        return this;
    }
    off<E>(event: FileEvent, listener: FileListener<E>): this {
        this.eventEmitter.off(event, listener);
        return this;
    }
    emit<E>(event: FileEvent, file: E): boolean {
        return this.eventEmitter.emit(event, file);
    }
}

export class FileEventHandler2<C extends object> {
    eventEmitter: EventEmitter = new EventEmitter();

    emit<E extends keyof C>(event: E & string, file: C[E]): boolean {
        return this.eventEmitter.emit(event, file);
    }

    register<I extends FileEventListener<C>>(next: I): I {
        return next;
    }
}

export type FileEventListener<T> = {
    [K in keyof T]: FileListener<T[K]>;
};

class TestA {
    add = undefined;
}

class TestR {
    rem = "test";
}

type FileWatcherEvents = "Add" | "Remove" | "Change" | "TrackDir" | "UntrackDir";
interface TTT {
    add: TestA
    remove: TestR
};

const x = new FileEventHandler2<TTT>();
x.emit("add", new TestA());


export abstract class SingleInputFileEventHandler<CA, CR, CC, EA, ER, EC> extends FileEventHandler<EA, ER, EC> implements FileEventHandlerInput<CA, CR, CC> {
    abstract add: FileListener<CA>;
    abstract remove: FileListener<CR>;
    abstract change: FileListener<CC>;
}

export interface FileEventHandlerInput<CA, CR, CC> {
    add: FileListener<CA>;
    remove: FileListener<CR>;
    change: FileListener<CC>;
}

//provides
//uniform IN/OUT with two sets of generic Params
//method to chain modules together

//base class for all index modules