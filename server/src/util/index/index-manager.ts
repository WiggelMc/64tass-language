import { DocumentIndexManager } from "./document-index-manager/file-index-manager";
import { EditorManager } from "./editor-manager/editor-manager";
import { FileManager } from "./file-manager/file-manager";
import { FileWatcher } from "./file-watcher/file-watcher";
import { ProjectIndexManager } from "./project-index-manager/project-index-manager";

export class IndexManager {
    //chains modules together

    //file watcher
    //file manager  // editor manager
    //      document index manager
    //      project index manager

    // Parsers should be used via Generic Param with Interface

    // might be moved outside of util later
    do() {
        const fileWatcher = new FileWatcher<string>();
        const fileManager = new FileManager<string>();
        const editorManager = new EditorManager<string>();
        const documentIndexManager = new DocumentIndexManager<string>();
        const projectIndexManager = new ProjectIndexManager<string>();

        fileWatcher
            .register(fileManager)
            .register(documentIndexManager.file);

        editorManager
            .register(documentIndexManager.editor);

        documentIndexManager
            .register(projectIndexManager);
    }
}