import { _Connection, _ } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";
import * as chokidar from "chokidar";

export const fileSystemHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
 
        initFSWatcher();
    },
    capabilities: {
        
    }
};

function initFSWatcher() {
    chokidar.watch(".").on("all", (event, path) => {
		// fs.readFile(path, (err, data) => {
		// 	console.log("File Data: ", err, data?.toString());
		// });
		console.log("File Update: ",event, path);
	});
}