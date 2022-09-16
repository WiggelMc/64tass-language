/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import * as vscode from "vscode";

import { DidChangeConfigurationSignature, LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { sendViewInSourceFileRequest, getCurrentDocumentLocation, gotoDocumentLocation, sendViewInListFileRequest } from './util/list-file-utils';
import { Selector } from './common/capabilities/document-selector';
import { runTask, TaskMap } from './tasks';
import { TaskEndNotification, TaskParams, TaskStartNotification } from './common/capabilities/task';
import { AssembleTaskParams, AssembleTaskRequest, AssembleTaskResult } from './common/capabilities/assemble';

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
		documentSelector: Selector.all,
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

	vscode.commands.registerCommand("tass.viewInSource", viewInSource);
	vscode.commands.registerCommand("tass.viewInList", viewInList);
	vscode.commands.registerCommand("tass.assembleAndViewInList", assembleAndViewInList);

	vscode.tasks.onDidStartTask(onDidStartTask);
	vscode.tasks.onDidEndTask(onDidEndTask);

	vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration);
	
}

const onDidStartTask: (e: vscode.TaskStartEvent) => any =
async function(e) {
	
	const params: TaskParams = {
		task: e.execution.task.name
	};
	client.sendNotification(TaskStartNotification.method, params);
};

const onDidEndTask: (e: vscode.TaskEndEvent) => any =
async function(e) {
	
	const params: TaskParams = {
		task: e.execution.task.name
	};
	client.sendNotification(TaskEndNotification.method, params);
};

const onDidChangeConfiguration: (e: vscode.ConfigurationChangeEvent) => any =
async function(e) {

	if (e.affectsConfiguration("tasks")) {
		TaskMap.invalidate();
	}
};

async function viewInSource() {
		
	sendViewInSourceFileRequest(client, getCurrentDocumentLocation())
	.then(r => {

		console.log("View In Source", r);

		if (r === undefined || r === null) {
			vscode.window.showErrorMessage("Could not View In Source");
			return;
		}

		gotoDocumentLocation(r);
	});
}

async function viewInList() {

	sendViewInListFileRequest(client, getCurrentDocumentLocation())
	.then(r => {

		console.log("View In List", r);

		if (r === undefined || r === null) {
			vscode.window.showInformationMessage("Could not View In List");
			return;
		}

		gotoDocumentLocation(r);
	});
}

async function assembleAndViewInList() {

	const location = getCurrentDocumentLocation();
 
	const params: AssembleTaskParams = {
		textDocument: {
			uri: location.textDocument.uri
		}
	};

	const r: AssembleTaskResult = await client.sendRequest(AssembleTaskRequest.method, params);

	console.log("Result:", r);

	const taskName = r.task;

	const task = await TaskMap.getTask(taskName);

	console.log("Task:", task);

	if (task === undefined) {
		vscode.window.showErrorMessage(`Task '${taskName}' not found`);
		return;
	}

	runTask(task)
	.then(() => sendViewInListFileRequest(client, location))
	.then(r => {

		console.log("View In List (Assemble)", r);

		if (r === undefined || r === null) {
			vscode.window.showInformationMessage("Could not View In List");
			return;
		}

		gotoDocumentLocation(r);
	});
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
