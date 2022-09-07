import { ServerCapabilities, _, _Connection } from "vscode-languageserver";
import { completionHandler } from "./completion";
import { configurationHandler } from "./configuration";
import { fileSystemHandler } from "./file-system";
import { hoverHandler } from "./hover";
import { initializationHandler } from "./initialization";
import { semanticTokensHandler } from "./semantic-tokens";
import { textDocumentHandler } from "./text-document";

export interface ConnectionEventHandler {
    register: (connection: _Connection<_, _, _, _, _, _, _>) => void;
    capabilities: ServerCapabilities<any>;
}

const handlers : ConnectionEventHandler[] = [
	initializationHandler,
    configurationHandler,
    fileSystemHandler,
	semanticTokensHandler,
	textDocumentHandler,
	completionHandler,
    hoverHandler,
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