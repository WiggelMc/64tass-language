import { _Connection, _, TextDocumentSyncKind } from "vscode-languageserver";
import { ListFileLocationRequest } from "../common/capabilities/list-file";
import { ConnectionEventHandler } from "./handler";

export const listFileHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onRequest(ListFileLocationRequest.method, onListFileLocation);
    }
};

const onListFileLocation: ListFileLocationRequest =
async function(params) {

    console.log("ListFile Location: ", params);
    return {test: 1};
};