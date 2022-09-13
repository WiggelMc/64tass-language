/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import * as vscode from "vscode";

import {
	DocumentSelector,
	LanguageClient,
	LanguageClientOptions,
	ProtocolNotificationType0,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import { ListFileLocationRequest } from './common/capabilities/list-file';

let client: LanguageClient;

export function activate(context: ExtensionContext) {

	console.log("TEST");
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [
			{ scheme: 'file', language: '64tass' }
		],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();

	vscode.commands.registerCommand("tass.viewInSource", () => {
		console.log(1);
	});
	vscode.commands.registerCommand("tass.viewInList", () => {
		const editor = vscode.window.activeTextEditor;

		
		client.sendRequest(ListFileLocationRequest.method, {
			document: {
				uri: editor.document.uri.toString()
			},
			location: editor.selection.start
		}).then((response) => {
			console.log("BACK", response);
		});
	});
	vscode.commands.registerCommand("tass.assembleAndViewInList", () => {
		console.log(3);
	});



	let x: ListFileLocationRequest = () => {
		
	};

	// 	const t = vscode.window.createTextEditorDecorationType({
	// 		backgroundColor: "green",
	// 		gutterIconPath: path.join(__dirname, '..', '..', 'resources', 'type.png')
	// 	});

	// 	const te = vscode.window.createTextEditorDecorationType({
	// 		backgroundColor: "green",
	// 		gutterIconPath: path.join(__dirname, '..', '..', 'resources', 'type2.png')
	// 	});

	// vscode.workspace.onDidChangeTextDocument(event => {
	// 	const openEditor = vscode.window.visibleTextEditors.filter(
	// 		editor => editor.document.uri === event.document.uri
	// 	  )[0];
	// 	console.log("SET DECO");
	// 	openEditor.setDecorations(
	// 		t,
	// 		[
	// 			{
	// 				range: new vscode.Range(1,0,1,0),
	// 				renderOptions: {
	// 					before: {contentText: "Test |"},
	// 				},
	// 			},
	// 			{
	// 				range: new vscode.Range(2,0,2,0),
	// 				renderOptions: {
	// 					before: {contentText: "Test |"},
	// 				},
	// 			},
	// 			{
	// 				range: new vscode.Range(3,0,3,0),
	// 				renderOptions: {
	// 					before: {contentText: "Test |"},
	// 				},
	// 			}
	// 		]
	// 	);
	// 	openEditor.setDecorations(
	// 		te,
	// 		[
	// 			{
	// 				range: new vscode.Range(1,1,1,1),
	// 				hoverMessage: "TEST123"
	// 			}
	// 		]
	// 	);
	// });
	
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
