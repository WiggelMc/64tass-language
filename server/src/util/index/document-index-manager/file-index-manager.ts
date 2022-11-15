import { FileEventHandler, FileEventHandlerInput } from "../file-event-handler";

export class DocumentIndexManager<T> extends FileEventHandler<T,T,T> {
    file: FileEventHandlerInput<T,T,T> = {
        add: this.emitAdd,
        remove: this.emitRemove,
        change: this.emitChange,
    };
    editor: FileEventHandlerInput<T,T,T> = {
        add: this.emitAdd,
        remove: this.emitRemove,
        change: this.emitChange,
    };

    //Manages Files including
    //   their possible dependencies/dependents
    //   their parsed contents
}