import { _Connection, _, DocumentLink, DocumentLinkParams, RequestHandler, ServerRequestHandler, Range } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const documentLinkHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onDocumentLinks(onDocumentLinks);
        connection.onDocumentLinkResolve(onDocumentLinkResolve);
    },
    capabilities: {
        
        documentLinkProvider: {
            resolveProvider: true
        }
    }
};

const onDocumentLinks: ServerRequestHandler<DocumentLinkParams, DocumentLink[] | undefined | null, DocumentLink[], void> = 
async function(params, token, workDoneProgress, resultProgress) {

    console.log("DocumentLinks: ", params);
    return [
        DocumentLink.create(Range.create(15,1,15,10))
    ];
};

const onDocumentLinkResolve: RequestHandler<DocumentLink, DocumentLink | undefined | null, void> = 
async function(params, token) {

    console.log("DocumentLinks Resolve: ", params);
    return DocumentLink.create(Range.create(15,1,15,10), "https://google.com");
};