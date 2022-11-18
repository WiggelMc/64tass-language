import { DocumentIndexManagerMessages } from "../document-index-manager/document-index-manager";
import { FileEventEmitter } from "../file-event-handler";

export class EditorManager<T> extends FileEventEmitter<DocumentIndexManagerMessages<T>> {

    //manages files from the editor
}