import { _Connection, _, TextDocumentSyncKind } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const initializationHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        

    },
    capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental
    }
};