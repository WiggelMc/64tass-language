import { Range, TextDocumentIdentifier } from "vscode-languageclient";

export interface ViewInListFileRequest {
    (params: DocumentLocation): DocumentLocation | Promise<DocumentLocation>
}
export namespace ViewInListFileRequest {
    export const method = "64tass.ViewInListFile";
}

export interface ViewInSourceFileRequest {
    (params: DocumentLocation): DocumentLocation | Promise<DocumentLocation>
}
export namespace ViewInSourceFileRequest {
    export const method = "64tass.ViewInSourceFile";
}

export interface DocumentLocation {
    textDocument: TextDocumentIdentifier
    range: Range
}