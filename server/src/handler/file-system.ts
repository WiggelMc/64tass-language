import { _Connection, _ } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";
import * as chokidar from "chokidar";
import * as Path from "path";
import * as fs from "fs";
import { configFilename } from "../document-selector";

export const fileSystemHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
 
        chokidar.watch(".").on("all", onChokidarAll);
    }
};

const onChokidarAll: ((eventName: 'add'|'addDir'|'change'|'unlink'|'unlinkDir', path: string, stats?: fs.Stats) => void) =
async function(event, path) {

    // fs.readFile(path, (err, data) => {
    // 	console.log("File Data: ", err, data?.toString());
    // });
    console.log("File Update: ",event, path);
    let filename = Path.basename(path);
    
    if (filename === configFilename) {
        onConfigChange(path);
    }
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
        console.log("Config not Parsed: ", path, error);
        return;
    }

    // add/update config
    console.log("Config Update: ", path, obj);
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