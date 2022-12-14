import { _Connection, _, TextDocumentSyncKind, TextDocumentFilter } from "vscode-languageserver";
import { ViewInListFileRequest, ViewInSourceFileRequest } from "../common/capabilities/list-file";
import { ConnectionEventHandler } from "./handler";

export const listFileHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onRequest(ViewInListFileRequest.method, onViewInListFile);
        connection.onRequest(ViewInSourceFileRequest.method, onViewInSourceFile);
    }
};

const onViewInListFile: ViewInListFileRequest =
async function(params) {

    console.log("View in List File: ", params);

    if (params === undefined || params === null) {
        return undefined;
    }

    return {
        textDocument: {uri: 'file:///c%3A/Users/kimhh/Documents/SNESProgramming/vscode/64tass-language/testing-code/workspace1/out/game.list'},
        range: params.range
    };
};

const onViewInSourceFile: ViewInSourceFileRequest =
async function(params) {

    console.log("View in Source File: ", params);

    if (params === undefined || params === null) {
        return undefined;
    }

    return {
        textDocument: {uri: 'file:///c%3A/Users/kimhh/Documents/SNESProgramming/vscode/64tass-language/testing-code/workspace1/Test1/master.asm'},
        range: params.range
    };
};
