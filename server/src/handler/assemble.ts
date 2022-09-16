import { _Connection, _, TextDocumentSyncKind, TextDocumentFilter } from "vscode-languageserver";
import { AssembleTaskRequest } from "../common/capabilities/assemble";
import { ConnectionEventHandler } from "./handler";

export const assembleHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onRequest(AssembleTaskRequest.method, onAssembleTask);
    }
};

const onAssembleTask: AssembleTaskRequest =
async function(params) {

    console.log("Fetch Assemble Task: ", params);
    return {
        task: "Assemble"
    };
};