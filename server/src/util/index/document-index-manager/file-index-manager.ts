import { FileEventHandler, FileEventHandler2, FileEventHandlerInput, FileEventListener } from "../file-event-handler";
import { ProjectIndexManagerMessages } from "../project-index-manager/project-index-manager";

export interface DocumentIndexManagerMessages<F> {
    add: F
    remove: F
    change: F
}

export class DocumentIndexManager<T> extends FileEventHandler2<ProjectIndexManagerMessages<T>> {
    file: FileEventListener<DocumentIndexManagerMessages<T>> = {
        add: f => this.emit("add", f),
        remove: f => this.emit("remove", f),
        change: f => this.emit("change", f),
    };
    editor: FileEventListener<DocumentIndexManagerMessages<T>> = {
        add: f => this.emit("add", f),
        remove: f => this.emit("remove", f),
        change: f => this.emit("change", f),
    };

    //Manages Files including
    //   their possible dependencies/dependents
    //   their parsed contents
}