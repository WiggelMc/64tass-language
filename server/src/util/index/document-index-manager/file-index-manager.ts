import { FileEventHandler, FileListener } from "../file-event-handler";

export class DocumentIndexManager<T> extends FileEventHandler<T,T,T,T,T,T> {
    add: FileListener<T> = this.emitAdd;
    remove: FileListener<T> = this.emitRemove;
    change: FileListener<T> = this.emitChange;

    //Manages Files including
    //   their possible dependencies/dependents
    //   their parsed contents
}