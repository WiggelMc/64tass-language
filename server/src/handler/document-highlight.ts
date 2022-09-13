import { _Connection, _, DocumentHighlight, DocumentHighlightParams, ServerRequestHandler, Range, DocumentHighlightKind } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const documentHighlightHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onDocumentHighlight(onDocumentHighlight);
    },
    capabilities: {
        
        documentHighlightProvider: true
    }
};

const onDocumentHighlight: ServerRequestHandler<DocumentHighlightParams, DocumentHighlight[] | undefined | null, DocumentHighlight[], void> =
async function(params, token, workDoneProgress, resultProgress) {
    
    console.log("Document Highlight: ", params);
    return [
        DocumentHighlight.create(Range.create(6,0,6,5), DocumentHighlightKind.Text)
    ];
};