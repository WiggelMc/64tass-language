import { Listener, FileEventListener } from "../file-event-handler";

export interface ProjectIndexManagerMessages<F> {
    add: F
    remove: F
    change: F
}

export class ProjectIndexManager<T> implements FileEventListener<ProjectIndexManagerMessages<T>> {
    add: Listener<T> = f => { };
    remove: Listener<T> = f => { };
    change: Listener<T> = f => { };

    //Manages Files including
    //   their actual dependencies/dependents
    //   their final contents 
}