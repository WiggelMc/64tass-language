import { DidChangeTextDocumentParams, DidCloseTextDocumentParams, DidOpenTextDocumentParams, DidSaveTextDocumentParams, NotificationHandler, SemanticTokensRefreshRequest, TextDocumentIdentifier, TextDocumentSyncKind, _, _Connection } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { connection } from "../server";
import { ConnectionEventHandler } from "./handler";

export const textDocumentHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onDidChangeTextDocument(onDidChangeTextDocument);
        connection.onDidOpenTextDocument(onDidOpenTextDocument);
        connection.onDidCloseTextDocument(onDidCloseTextDocument);
        connection.onDidSaveTextDocument(onDidSaveTextDocument);
    },
    capabilities: {
        
        textDocumentSync: TextDocumentSyncKind.Incremental
    }
};

let savedDoc: TextDocumentIdentifier;

const onDidChangeTextDocument: NotificationHandler<DidChangeTextDocumentParams> =
async function(params) {

	let doc = params.textDocument;
	let changes = params.contentChanges;
	
	console.log("Changed: ",doc.version, ...changes);

    if (!savedDoc) {
        console.log("doc saved: ",doc);
        savedDoc = doc;
    } else {
        console.log("doc will reload tokens: ",savedDoc);
        connection.sendRequest(SemanticTokensRefreshRequest.method, {});
        connection.languages.inlineValue.refresh();
    }
};

const onDidOpenTextDocument: NotificationHandler<DidOpenTextDocumentParams> =
async function(params) {
    
    console.log("Open: ",params);
};

const onDidCloseTextDocument: NotificationHandler<DidCloseTextDocumentParams> =
async function(params) {
    
    console.log("Close: ",params);
};

const onDidSaveTextDocument: NotificationHandler<DidSaveTextDocumentParams> = 
async function(params) {

    console.log("Save: ",params);
};