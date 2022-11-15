import { EventEmitter } from "events";
import { enumValues } from "../enum";

export enum FileEvent {
    add = 'AddFile',
    remove = 'RemoveFile',
    change = 'ChangeFile',
}

export type FileEmitter<F> = (file: F) => boolean;
export type FileListener<F> = (file: F) => void;

export abstract class FileEventHandler<CA, CR, CC, EA, ER, EC> {
    eventEmitter: EventEmitter = new EventEmitter();

    register<NA, NR, NC>(next: FileEventHandler<EA, ER, EC, NA, NR, NC>): typeof next {

        this.onAdd(next.add);
        this.onRemove(next.remove);
        this.onChange(next.change);

        return next;
    }

    abstract add: FileListener<CA>;
    abstract remove: FileListener<CR>;
    abstract change: FileListener<CC>;

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

//provides
//uniform IN/OUT with two generic Params <C,E>
//method to chain modules together

//base class for all index modules


//current solution assumes that all inputs and all outputs are the same
//this leads to problems as add, get and remove need different

//possible solution
//FileEventHandler<CA,CR,CC, EA,ER,EC>