import { DidChangeTextDocumentParams, DidCloseTextDocumentParams, DidOpenTextDocumentParams, DidSaveTextDocumentParams, NotificationHandler, _, _Connection } from "vscode-languageserver";

export function register(connection: _Connection<_, _, _, _, _, _, _>) {
    
    connection.onDidChangeTextDocument(onDidChangeTextDocument);
    connection.onDidOpenTextDocument(onDidOpenTextDocument);
    connection.onDidCloseTextDocument(onDidCloseTextDocument);
    connection.onDidSaveTextDocument(onDidSaveTextDocument);
}

const onDidChangeTextDocument: NotificationHandler<DidChangeTextDocumentParams> =
async function(params) {

	let doc = params.textDocument;
	let changes = params.contentChanges;
	
	console.log("Changed: ",doc.version, ...changes);
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