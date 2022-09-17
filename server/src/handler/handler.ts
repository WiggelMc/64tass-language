import { ServerCapabilities, _, _Connection } from "vscode-languageserver";
import { codeActionHandler } from "./code-action";
import { codeLensHandler } from "./code-lens";
import { completionHandler } from "./completion";
import { configurationHandler } from "./configuration";
import { definitionHandler } from "./definition";
import { diagnosticsHandler } from "./diagnostics";
import { documentFormattingHandler } from "./document-formatting";
import { documentHighlightHandler } from "./document-highlight";
import { documentLinkHandler } from "./document-link";
import { executeCommandHandler } from "./execute-command";
import { fileSystemHandler } from "./file-system";
import { foldingRangeHandler } from "./folding-ranges";
import { hoverHandler } from "./hover";
import { initializationHandler } from "./initialization";
import { inlayHintHander } from "./inlay-hint";
import { inlineValueHandler } from "./inline-value";
import { linkedEditingRangeHandler } from "./linked-editing-range";
import { listFileHandler } from "./list-file";
import { monikerHandler } from "./moniker";
import { renameHandler } from "./rename";
import { selectionRangeHandler } from "./selection-range";
import { semanticTokensHandler } from "./semantic-tokens";
import { signatureInformationHandler } from "./signature-information";
import { symbolHandler } from "./symbol";
import { taskHandler } from "./task";
import { textDocumentHandler } from "./text-document";

export interface ConnectionEventHandler {
    register: (connection: _Connection<_, _, _, _, _, _, _>) => void;
    capabilities?: ServerCapabilities<any>;
    experimentalCapabilities?: any;
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
    listFileHandler,
    renameHandler,
    foldingRangeHandler,
    executeCommandHandler,
    linkedEditingRangeHandler,
    documentHighlightHandler,
    documentFormattingHandler,
    definitionHandler,
    diagnosticsHandler,
    taskHandler,
];

export function registerHandlers(connection: _Connection<_, _, _, _, _, _, _>) {

    for (const handler of handlers) {
        handler.register(connection);
    }
}

export function getCapabilities(): ServerCapabilities<any> {

    const capabilities = Object.assign(
        {},
        ...handlers.map(h => h.capabilities),
        getExperimentalCapabilities()
    );

    console.log("Capabilities: ",capabilities);

    return capabilities;
}

function getExperimentalCapabilities(): ServerCapabilities<any> {

    const experimentalCapabilities = Object.assign(
        {},
        ...handlers.map(h => h.experimentalCapabilities)
    );

    const capabilities = {
        experimental: experimentalCapabilities
    };

    return capabilities;
}