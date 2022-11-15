import { EventEmitter } from "events";
import { OnFileRemoved } from "./file";

const REMOVE_FILE_EVENT = Symbol('RemoveFile');
const ADD_FILE_EVENT = Symbol('AddFile');
const CHANGE_FILE_EVENT = Symbol('ChangeFile');

export class FileEventEmitter<F> {
    eventEmitter: EventEmitter = new EventEmitter();
    
    onFileRemoved(listener: OnFileRemoved<F>): this {
        this.eventEmitter.on(REMOVE_FILE_EVENT, listener);
        return this;
    }
    offFileRemoved(listener: OnFileRemoved<F>): this {
        this.eventEmitter.off(REMOVE_FILE_EVENT, listener);
        return this;
    }
    emitFileRemoved(file: F): boolean {
        return this.eventEmitter.emit(REMOVE_FILE_EVENT, file);
    }
}