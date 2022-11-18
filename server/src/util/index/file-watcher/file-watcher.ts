import { FileEventEmitter } from "../file-event-handler";
import { FileManagerMessages } from "../file-manager/file-manager";

export class FileWatcher<F> extends FileEventEmitter<FileManagerMessages<F>> {

    do() {
        this.emit("trackDir", "testDir/Peter");
    }
    //contains FileListenerWatchers and manages them
}