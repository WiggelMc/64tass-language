import { ExtensionContext } from 'vscode';

import { registerClientHandlers } from './handler';
import { client, initClient } from './util/languageclient';

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
