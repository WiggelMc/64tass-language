import { FileEventHandler, FileListener } from "../file-event-handler";

export class FileWatcher<T> extends FileEventHandler<T,T,T,T,T,T> {
    add: FileListener<T> = this.emitAdd;
    remove: FileListener<T> = this.emitRemove;
    change: FileListener<T> = this.emitChange;

    //contains FileListenerWatchers and manages them
}