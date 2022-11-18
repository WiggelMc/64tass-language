import { FileEventHandler2 } from "../file-event-handler";
import { FileManagerMessages } from "../file-manager/file-manager";

export class FileWatcher<F> extends FileEventHandler2<FileManagerMessages<F>> {

    do() {
        this.emit("trackDir", "testDir/Peter");
    }
    //contains FileListenerWatchers and manages them
}