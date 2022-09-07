import { _Connection, _, DocumentSymbol, DocumentSymbolParams, ServerRequestHandler, SymbolInformation, WorkspaceSymbolParams, SymbolKind, Range } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const symbolHandler: ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onDocumentSymbol(onDocumentSymbol);
        connection.onWorkspaceSymbol(onWorkspaceSymbol);
    },
    capabilities: {
        documentSymbolProvider: true,
        workspaceSymbolProvider: true
    }
};

const onDocumentSymbol: ServerRequestHandler<DocumentSymbolParams, SymbolInformation[] | DocumentSymbol[] | undefined | null, SymbolInformation[] | DocumentSymbol[], void> = 
async function(params, token, workDoneProgress, resultProgress) {

    return [
        SymbolInformation.create("name",SymbolKind.Class, Range.create(10,0,12,0), undefined, undefined),
        SymbolInformation.create("name2",SymbolKind.Function, Range.create(11,0,11,10), undefined, undefined)
    ];
};

const onWorkspaceSymbol: ServerRequestHandler<WorkspaceSymbolParams, SymbolInformation[] | undefined | null, SymbolInformation[], void> = 
async function(params, token, workDoneProgress, resultProgress) {

    return [];
};