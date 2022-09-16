import { _Connection, _, TextDocumentSyncKind, NotificationHandler, InitializedParams, InitializeError, InitializeParams, InitializeResult, ServerRequestHandler, DidChangeConfigurationNotification, WorkspaceFoldersChangeEvent } from "vscode-languageserver";
import { globalCapabilities } from "../data/data";
import { connection } from "../server";
import { configSections } from "./configuration";
import { ConnectionEventHandler, getCapabilities } from "./handler";

export const initializationHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onInitialize(onInitialize);
        connection.onInitialized(onInitialized);
    }
};

const onInitialize: ServerRequestHandler<InitializeParams, InitializeResult, never, InitializeError> = 
async function(params, token, workDoneProgress, resultProgress) {
    const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	globalCapabilities.hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	globalCapabilities.hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);

	const result: InitializeResult = {
		capabilities: getCapabilities()
	};
	if (globalCapabilities.hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true,
				changeNotifications: true
			}
		};
	}
	return result;
};

const onInitialized: NotificationHandler<InitializedParams> = 
async function(params) {

	console.log("GLOBAL CAPABILITIES: ", globalCapabilities);

    if (globalCapabilities.hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, {section: configSections});
	}
	if (globalCapabilities.hasWorkspaceFolderCapability) {
		
		connection.workspace.onDidChangeWorkspaceFolders(onDidChangeWorkspaceFolders);
	}
};

const onDidChangeWorkspaceFolders: (e: WorkspaceFoldersChangeEvent) => any =
async function(e) {
    
    console.log("Change folders: ", e);
};