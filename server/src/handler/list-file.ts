import { _Connection, _, TextDocumentSyncKind } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const listFileHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        // connection.onRequest();
    },
    experimentalCapabilities: {
        listFileProvider: true
    }
};