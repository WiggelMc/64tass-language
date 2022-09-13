import { _Connection, _, DocumentFormattingParams, DocumentOnTypeFormattingParams, DocumentRangeFormattingParams, RequestHandler, ServerRequestHandler, TextEdit } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const documentFormattingHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onDocumentFormatting(onDocumentFormatting);
        connection.onDocumentRangeFormatting(onDocumentRangeFormatting);
        connection.onDocumentOnTypeFormatting(onDocumentOnTypeFormatting);
    },
    capabilities: {
        
        documentFormattingProvider: true,
        documentRangeFormattingProvider: true,
        documentOnTypeFormattingProvider: {
            firstTriggerCharacter: "#",
            moreTriggerCharacter: [
                "*"
            ]
        }
    }
};

const onDocumentFormatting: ServerRequestHandler<DocumentFormattingParams, TextEdit[] | undefined | null, never, void> = 
async function(params, token, workDoneProgress, resultProgress) {
    
    console.log("Formatting Full: ", params);
    return [];
};

const onDocumentRangeFormatting: ServerRequestHandler<DocumentRangeFormattingParams, TextEdit[] | undefined | null, never, void> =
async function(params, token, workDoneProgress, resultProgress) {
    
    console.log("Formatting Range: ", params);
    return [];
};

const onDocumentOnTypeFormatting: RequestHandler<DocumentOnTypeFormattingParams, TextEdit[] | undefined | null, void> =
async function(params, token) {
    
    console.log("Formatting OnType: ", params);
    return [];
};