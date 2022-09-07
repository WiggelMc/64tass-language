import { ServerCapabilities, _, _Connection } from "vscode-languageserver";
import { completionHandler } from "../handler/completion";
import { configurationHandler } from "../handler/configuration";
import { fileSystemHandler } from "../handler/file-system";
import { ConnectionEventHandler } from "../handler/handler";
import { initializationHandler } from "../handler/initialization";
import { semanticTokensHandler } from "../handler/semantic-tokens";
import { textDocumentHandler } from "../handler/text-document";

export interface DocumentSettings {
	maxNumberOfProblems: number;
}

export const defaultSettings: DocumentSettings = {
     maxNumberOfProblems: 1000 
};

export let globalSettings: DocumentSettings = defaultSettings;

export const documentSettings: Map<string, Thenable<DocumentSettings>> = new Map();

export const config = {
    hasConfigurationCapability: false,
    hasWorkspaceFolderCapability: false,
    hasDiagnosticRelatedInformationCapability: false,
    globalSettings: defaultSettings
};

const handlers : ConnectionEventHandler[] = [
	initializationHandler,
    configurationHandler,
    fileSystemHandler,
	semanticTokensHandler,
	textDocumentHandler,
	completionHandler,
];

export function registerHandlers(connection: _Connection<_, _, _, _, _, _, _>) {
    for (const handler of handlers) {
        handler.register(connection);
    }
}

export function getCapabilities(): ServerCapabilities<any> {
    return Object.assign(
        {},
        ...handlers.map(h => h.capabilities)
    );
}