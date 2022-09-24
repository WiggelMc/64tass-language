import { _Connection, _, WorkspaceFolder } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";
import * as Path from "path";
import * as fs from "fs";
import { configFilename } from "../common/capabilities/document-selector";
import { URI } from "vscode-uri";
import { ConditionalFileWatcher, FileWatcherMap } from "../util/file-watcher-map";

export const fileSystemHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
 
        
    }
};

let fileWatchers: FileWatcherMap = new FileWatcherMap();

export function registerFileWatchers(folders: WorkspaceFolder[] | null) {

    if (folders === null) {
        return;
    }

    for (const folder of folders) {
        const uri = URI.parse(folder.uri);
        registerFileWatcher(uri.fsPath);
    }

    console.log("FSWATCH: ", fileWatchers.toString());
}

export function unregisterFileWatchers(folders: WorkspaceFolder[] | null) {

    if (folders === null) {
        return;
    }

    for (const folder of folders) {
        const uri = URI.parse(folder.uri);
        unregisterFileWatcher(uri.fsPath);
    }

    console.log("FSUNWATCH: ", fileWatchers.toString());
}

export function registerFileWatcher(fsPath: string) {

    fileWatchers.add(fsPath, new ConditionalFileWatcher(fsPath, createFileSystemListener(fsPath)));
}

export function unregisterFileWatcher(fsPath: string) {

    fileWatchers.remove(fsPath);

    //The files in the removed workspace need to be removed from index manually (TODO) [either here or in onChangeWorkspaceFolders]
}

const createFileSystemListener: ((workspaceFolderPath: string) => ((eventName: 'add'|'addDir'|'change'|'unlink'|'unlinkDir', path: string, stats?: fs.Stats) => void)) =
function(workspaceFolderPath) {
    return async function(event, path, stats) {

        // fs.readFile(path, (err, data) => {
        // 	console.log("File Data: ", err, data?.toString());
        // });
        // console.log("---   File Update   ---\nEvent:   %s\nFile:    %s\nFolder:  %s\n",event, path.substring(77), workspaceFolderPath.substring(77));
        let filename = Path.basename(path);
        
        if (filename === configFilename) {
            onConfigChange(path);
        }
    };
};

async function onConfigChange(path: fs.PathLike) {

    if (!fs.existsSync(path)) {
        // remove config
        console.log("Config Remove: ", path);
        return;
    }
    const configContents = fs.readFileSync(path, 'utf8');

    let obj: ConfigJSON;

    try {
        obj = JSON.parse(configContents);
    } catch (error) {
        console.log("64tass Config not Parsed: ", path, error);
        return;
    }

    // add/update config
    console.log("64tass Config Update: ", path, obj);
}

interface ConfigJSON {
    ["cpu"]: "6502" | "65c02" | "65ce02" | "6502i" | "65816" | "65dtv02" | "65el02" | "r65c02" | "w65c02" | "4510"
    ["case-sensitive"]: boolean
    ["tasm-compatible"]: boolean
    ["include-search-path"]: String[]
    ["master-file"]: String
    ["list-file"]: String
    ["assemble-task"]: String
}