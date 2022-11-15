import { EventEmitter } from "events";

export enum FileEvent {
    add = 'AddFile',
    remove = 'RemoveFile',
    change = 'ChangeFile',
}

export type FileEmitter<F> = (file: F) => boolean;
export type FileListener<F> = (file: F) => void;

export class FileEventHandler<C, E> {
    eventEmitter: EventEmitter = new EventEmitter();
    
    on(event: FileEvent, listener: FileListener<E>): this {
        this.eventEmitter.on(event, listener);
        return this;
    }
    off(event: FileEvent, listener: FileListener<E>): this {
        this.eventEmitter.off(event, listener);
        return this;
    }
    emit(event: FileEvent, file: E): boolean {
        return this.eventEmitter.emit(event, file);
    }
    getEmitter(event: FileEvent): FileEmitter<E> {
        return file => this.emit(event, file); 
    }
}

//provides
//uniform IN/OUT with two generic Params <C,E>
//method to chain modules together

//base class for all index modules