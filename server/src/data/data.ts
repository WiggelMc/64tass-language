import { _, _Connection } from "vscode-languageserver";

export interface DocumentSettings {
	maxNumberOfProblems: number;
}

export const defaultSettings: DocumentSettings = {
     maxNumberOfProblems: 1000 
};

export let globalSettings: DocumentSettings = defaultSettings;

export const documentSettings: Map<string, Thenable<DocumentSettings>> = new Map();

export const globalDocumentSettings = {
    settings: defaultSettings
};

export const globalCapabilities = {
    hasConfigurationCapability: false,
    hasWorkspaceFolderCapability: false,
    hasDiagnosticRelatedInformationCapability: false
};