import { FileListener, FileEventHandlerInput } from "../file-event-handler";

export class ProjectIndexManager<T> implements FileEventHandlerInput<T, T, T> {
    add: FileListener<T> = f => { };
    remove: FileListener<T> = f => { };
    change: FileListener<T> = f => { };

    //Manages Files including
    //   their actual dependencies/dependents
    //   their final contents 
}