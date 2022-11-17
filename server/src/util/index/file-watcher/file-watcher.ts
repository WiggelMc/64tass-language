import { SingleInputFileEventHandler, FileListener } from "../file-event-handler";
import { FilePath, FileWithPath } from "../file";

export class FileWatcher<T> extends SingleInputFileEventHandler<FileWithPath<T>, FilePath, T, FileWithPath<T>, FilePath, T> {
    add: FileListener<FileWithPath<T>> = this.emitAdd;
    remove: FileListener<FilePath> = this.emitRemove;
    change: FileListener<T> = this.emitChange;

    //contains FileListenerWatchers and manages them
}