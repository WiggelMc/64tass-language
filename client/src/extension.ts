/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext, TerminalOptions, ExtensionTerminalOptions } from 'vscode';
import * as vscode from "vscode";

import { Disposable, LanguageClient, LanguageClientOptions, Range, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { sendViewInSourceFileRequest, getCurrentDocumentLocation, gotoDocumentLocation, sendViewInListFileRequest, gotoDocumentLocationStoppable } from './util/list-file-utils';
import { Selector } from './common/capabilities/document-selector';
import { runTask, sendTaskFetchRequest, TaskMap } from './tasks';
import { TaskEndRequest, TaskFetchParams, TaskParams, TaskResult, TaskStartRequest, TaskType } from './common/capabilities/task';
import { DocumentLocation } from './common/capabilities/list-file';
import { displayErrorMessage } from './handler/error';
import { configHandler } from './handler/config';
import { setErrorShown, terminalHandler } from './handler/terminal';
import { taskHandler } from './handler/task';
import { executeHandler } from './handler/execute';

export let client: LanguageClient;

export function activate(context: ExtensionContext) {

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

	const handlers: Disposable[] = [
	
		...executeHandler.register(context),
		...taskHandler.register(context),
		...configHandler.register(context),
		...terminalHandler.register(context),
		
	];

	context.subscriptions.push(...handlers);

	console.log("Extension '64tass-language' is loaded");
}

export function deactivate(): Thenable<void> | undefined {

	if (!client) {
		return undefined;
	}
	return client.stop();
}
