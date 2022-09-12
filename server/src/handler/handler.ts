import { ServerCapabilities, _, _Connection } from "vscode-languageserver";
import { codeActionHandler } from "./code-action";
import { codeLensHandler } from "./code-lens";
import { completionHandler } from "./completion";
import { configurationHandler } from "./configuration";
import { documentLinkHandler } from "./document-link";
import { fileSystemHandler } from "./file-system";
import { hoverHandler } from "./hover";
import { initializationHandler } from "./initialization";
import { inlayHintHander } from "./inlay-hint";
import { inlineValueHandler } from "./inline-value";
import { monikerHandler } from "./moniker";
import { selectionRangeHandler } from "./selection-range";
import { semanticTokensHandler } from "./semantic-tokens";
import { signatureInformationHandler } from "./signature-information";
import { symbolHandler } from "./symbol";
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
    symbolHandler,
    signatureInformationHandler,
    monikerHandler,
    codeLensHandler,
    inlayHintHander,
    inlineValueHandler,
    selectionRangeHandler,
    codeActionHandler,
    documentLinkHandler,
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