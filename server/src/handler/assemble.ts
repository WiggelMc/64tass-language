import { _Connection, _, TextDocumentSyncKind, TextDocumentFilter } from "vscode-languageserver";
import { DidAssembleRequest, DidStartAssembleRequest, WillConditionalAssembleRequest } from "../common/capabilities/assemble";
import { ConnectionEventHandler } from "./handler";

export const assembleHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onRequest(WillConditionalAssembleRequest.method, onWillConditionalAssemble);
        connection.onRequest(DidStartAssembleRequest.method, onDidStartAssemble);
        connection.onRequest(DidAssembleRequest.method, onDidAssemble);
    }
};

const onWillConditionalAssemble: WillConditionalAssembleRequest =
async function(params) {

    console.log("Will Conditional Assemble: ", params);
};

const onDidStartAssemble: DidStartAssembleRequest =
async function(params) {

    console.log("Did Start assemble: ", params);
};

const onDidAssemble: DidAssembleRequest =
async function(params) {

    console.log("Did Assemble: ", params);
};