import { EventEmitter } from "events";
import { OnFileRemoved } from "./file-manager/file";

const REMOVE_FILE_EVENT = Symbol('RemoveFile');
const ADD_FILE_EVENT = Symbol('AddFile');
const CHANGE_FILE_EVENT = Symbol('ChangeFile');

export class FileEventHandler<C, E> {
    eventEmitter: EventEmitter = new EventEmitter();
    
    onFileRemoved(listener: OnFileRemoved<E>): this {
        this.eventEmitter.on(REMOVE_FILE_EVENT, listener);
        return this;
    }
    offFileRemoved(listener: OnFileRemoved<E>): this {
        this.eventEmitter.off(REMOVE_FILE_EVENT, listener);
        return this;
    }
    emitFileRemoved(file: E): boolean {
        return this.eventEmitter.emit(REMOVE_FILE_EVENT, file);
    }
}

//provides
//uniform IN/OUT with two generic Params <C,E>
//method to chain modules together

//base class for all index modules