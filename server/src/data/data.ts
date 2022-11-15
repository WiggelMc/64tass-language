import { _, _Connection } from "vscode-languageserver";

export interface ExtensionSettings {
    maxNumberOfProblems: number;
}

export const defaultSettings: ExtensionSettings = {
    maxNumberOfProblems: 1000
};

export const documentSettings: Map<string, Thenable<ExtensionSettings>> = new Map();

export const globalDocumentSettings = {
    settings: defaultSettings
};

export const globalCapabilities = {
    hasConfigurationCapability: false,
    hasWorkspaceFolderCapability: false
};