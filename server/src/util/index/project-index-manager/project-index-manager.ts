import { FileListener, FileEventListener } from "../file-event-handler";

export interface ProjectIndexManagerMessages<F> {
    add: F
    remove: F
    change: F
}

export class ProjectIndexManager<T> implements FileEventListener<ProjectIndexManagerMessages<T>> {
    add: FileListener<T> = f => { };
    remove: FileListener<T> = f => { };
    change: FileListener<T> = f => { };

    //Manages Files including
    //   their actual dependencies/dependents
    //   their final contents 
}