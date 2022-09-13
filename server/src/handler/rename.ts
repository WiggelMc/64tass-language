import { _Connection, _, RequestHandler, PrepareRenameParams, Range, ServerRequestHandler, RenameParams, WorkspaceEdit, TextDocumentEdit, TextEdit, uinteger } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const renameHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onPrepareRename(onPrepareRename);
        connection.onRenameRequest(onRenameRequest);
    },
    capabilities: {

        renameProvider: {
            prepareProvider: true
        }
    }
};

const onPrepareRename: RequestHandler<PrepareRenameParams, Range | {
    range: Range;
    placeholder: string;
} | undefined | null, void> =
async function(params, token) {

    console.log("Rename Prepare: ", params);
    return Range.create(params.position.line,0,params.position.line,uinteger.MAX_VALUE);
};

const onRenameRequest: ServerRequestHandler<RenameParams, WorkspaceEdit | undefined | null, never, void> =
async function(params, token, workDoneProgress, resultProgress) {

    console.log("RenameRequest: ", params);
    return {
        documentChanges: [
            TextDocumentEdit.create({...params.textDocument, version: null}, [
                TextEdit.replace(Range.create(params.position.line,0,params.position.line,uinteger.MAX_VALUE),params.newName)
            ])
        ]
    };
};