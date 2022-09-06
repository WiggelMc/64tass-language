import { DidChangeTextDocumentParams, DidCloseTextDocumentParams, DidOpenTextDocumentParams, DidSaveTextDocumentParams, NotificationHandler } from "vscode-languageserver";

export const onDidChangeTextDocument: NotificationHandler<DidChangeTextDocumentParams> =
async function(params) {

	let doc = params.textDocument;
	let changes = params.contentChanges;
	
	console.log("Changed: ",doc.version, ...changes);
};

export const onDidOpenTextDocument: NotificationHandler<DidOpenTextDocumentParams> =
async function(params) {
    
    console.log("Open: ",params);
};

export const onDidCloseTextDocument: NotificationHandler<DidCloseTextDocumentParams> =
async function(params) {
    
    console.log("Close: ",params);
};

export const onDidSaveTextDocument: NotificationHandler<DidSaveTextDocumentParams> = 
async function(params) {

    console.log("Save: ",params);
};