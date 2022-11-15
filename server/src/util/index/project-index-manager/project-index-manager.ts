import { SingleInputFileEventHandler, FileListener } from "../file-event-handler";

export class ProjectIndexManager<T> extends SingleInputFileEventHandler<T,T,T,T,T,T> {
    add: FileListener<T> = this.emitAdd;
    remove: FileListener<T> = this.emitRemove;
    change: FileListener<T> = this.emitChange;

    //Manages Files including
    //   their actual dependencies/dependents
    //   their final contents 
}