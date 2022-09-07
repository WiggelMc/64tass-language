import { completionHandler } from "../handler/completion";
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

export const handlers : ConnectionEventHandler[] = [
	initializationHandler,
    fileSystemHandler,
	semanticTokensHandler,
	textDocumentHandler,
	completionHandler,
];