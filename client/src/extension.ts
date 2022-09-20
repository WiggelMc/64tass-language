/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ExtensionContext } from 'vscode';

import { registerClientHandlers } from './handler/handler';
import { client, initClient } from './handler/languageclient';

export function activate(context: ExtensionContext) {

	initClient(context);
	client.start();

	registerClientHandlers(context);

	console.log("Extension '64tass-language' is loaded");
}

export function deactivate(): Thenable<void> | undefined {

	if (!client) {
		return undefined;
	}
	return client.stop();
}
