import { _Connection, _, TextDocumentSyncKind, DidChangeConfigurationParams, NotificationHandler, InitializedParams, InitializeError, InitializeParams, InitializeResult, ServerRequestHandler, DidChangeConfigurationNotification } from "vscode-languageserver";
import { documentSettings, globalSettings, defaultSettings, DocumentSettings, config, handlers } from "../data/data";
import { connection } from "../server";
import { ConnectionEventHandler } from "./handler";

export const initializationHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onInitialize(onInitialize);
        connection.onInitialized(onInitialized);
    },
    capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental
    }
};

const onInitialize: ServerRequestHandler<InitializeParams, InitializeResult, never, InitializeError> = 
async function(params, token, workDoneProgress, resultProgress) {
    const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	config.hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	config.hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	config.hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: Object.assign(
			{},
			...handlers.map(h => h.capabilities)
		)
	};
	if (config.hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	return result;
};

const onInitialized: NotificationHandler<InitializedParams> = 
async function(params) {

    if (config.hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (config.hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
};