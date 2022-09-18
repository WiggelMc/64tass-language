/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import * as vscode from "vscode";

import { DidChangeConfigurationSignature, LanguageClient, LanguageClientOptions, Range, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { sendViewInSourceFileRequest, getCurrentDocumentLocation, gotoDocumentLocation, sendViewInListFileRequest } from './util/list-file-utils';
import { Selector } from './common/capabilities/document-selector';
import { runTask, sendTaskFetchRequest, TaskMap } from './tasks';
import { TaskEndNotification, TaskFetchParams, TaskParams, TaskStartNotification, TaskType } from './common/capabilities/task';
import { DocumentLocation } from './common/capabilities/list-file';

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

	vscode.commands.registerCommand("64tass.viewInSource", viewInSource);
	vscode.commands.registerCommand("64tass.viewInList", viewInList);
	vscode.commands.registerCommand("64tass.assembleAndViewInList", assembleAndViewInList);

	vscode.commands.registerCommand("64tass.assemble", assemble);
	vscode.commands.registerCommand("64tass.assembleAndStart", () => console.log("AS"));
	vscode.commands.registerCommand("64tass.start", () => console.log("S"));

	vscode.tasks.onDidStartTask(onDidStartTask);
	vscode.tasks.onDidEndTask(onDidEndTask);

	vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration);
	vscode.languages.onDidChangeDiagnostics(onDidChangeDiagnostics);
}

let errorShown = true;

const onDidChangeDiagnostics: (e: vscode.DiagnosticChangeEvent) => any =
async function(e) {

	if (!config.get("assemble.goto-error")) {
		errorShown = true;
		return;
	}

	if (errorShown) {
		return;
	}
	
	for (const uri of e.uris) {
		const error = vscode.languages.getDiagnostics(uri)
		.flat()
		.filter(
			d => d.source === "64tass Assembler" &&
			d.severity === vscode.DiagnosticSeverity.Error
		)
		.at(0);

		if (error !== undefined) {

			const location: DocumentLocation = {
				textDocument: {
					uri: uri.toString()
				},
				range: error.range
			};

			
			gotoDocumentLocation(location);
			errorShown = true;
			return;
		}
	}
};

const runningTasks: Map<vscode.Task,boolean> = new Map();

const onDidStartTask: (e: vscode.TaskStartEvent) => any =
async function(e) {
	
	runningTasks.set(e.execution.task, true);

	const params: TaskParams = {
		task: e.execution.task.name
	};
	client.sendNotification(TaskStartNotification.method, params);
};

const onDidEndTask: (e: vscode.TaskEndEvent) => any =
async function(e) {

	if (!runningTasks.has(e.execution.task)) {
		return;
	}
	runningTasks.delete(e.execution.task);

	const params: TaskParams = {
		task: e.execution.task.name
	};
	client.sendNotification(TaskEndNotification.method, params);

	errorShown = false; //do only when task is assemble or assemble and build
};

let config = vscode.workspace.getConfiguration("64tass-language");

const onDidChangeConfiguration: (e: vscode.ConfigurationChangeEvent) => any =
async function(e) {

	if (e.affectsConfiguration("tasks")) {
		TaskMap.invalidate();
	}

	if (e.affectsConfiguration("64tass-language")) {
		config = vscode.workspace.getConfiguration("64tass-language");
	}
};

async function viewInSource() {
		
	let location: DocumentLocation;
	try {
		location = getCurrentDocumentLocation();
	} catch (error) {
		vscode.window.showErrorMessage("No Open Editor");
		return;
	}

	sendViewInSourceFileRequest(client, location)
	.then(gotoDocumentLocation)
	.catch(displayErrorMessage);
}

async function viewInList() {

	let location: DocumentLocation;
	try {
		location = getCurrentDocumentLocation();
	} catch (error) {
		vscode.window.showErrorMessage("No Open Editor");
		return;
	}

	sendViewInListFileRequest(client, location)
	.then(gotoDocumentLocation)
	.catch(displayErrorMessage);
}

async function assembleAndViewInList() {

	let location: DocumentLocation;
	try {
		location = getCurrentDocumentLocation();
	} catch (error) {
		vscode.window.showErrorMessage("No Open Editor");
		return;
	}
	
	const params: TaskFetchParams = {
		textDocument: location.textDocument,
		taskType: TaskType.assemble
	};

	sendTaskFetchRequest(client, params)
	.then(r => TaskMap.getTask(r.task))
	.then(runTask)
	.then(() => sendViewInListFileRequest(client, location))
	.then(gotoDocumentLocation)
	.catch(displayErrorMessage);
}

async function assemble() {

	let location: DocumentLocation;
	try {
		location = getCurrentDocumentLocation();
	} catch (error) {
		vscode.window.showErrorMessage("No Open Editor");
		return;
	}
	
	const params: TaskFetchParams = {
		textDocument: location.textDocument,
		taskType: TaskType.assemble
	};

	sendTaskFetchRequest(client, params)
	.then(r => TaskMap.getTask(r.task))
	.then(runTask)
	.catch(displayErrorMessage);
}

function displayErrorMessage(error?: Error) {
	switch (error?.message) {
		case "Task not Found":
			vscode.window.showErrorMessage(`Could not find Assemble Task`);
			break;
		case "Source File not Found":
			vscode.window.showErrorMessage("Could not find Source File");
			break;
		case "List File not Found":
			vscode.window.showErrorMessage("Could not find List File");
			break;
		default:
			vscode.window.showErrorMessage(`Error while running Command`);
	}
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
