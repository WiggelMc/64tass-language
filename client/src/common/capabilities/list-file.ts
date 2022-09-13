import { Range, TextDocumentIdentifier } from "vscode-languageclient";

export interface ViewInListFileRequest {
    (params: OptionalDocumentLocation): OptionalDocumentLocation | Promise<OptionalDocumentLocation>
}
export namespace ViewInListFileRequest {
    export const method = "64tass.ViewInListFile";
}

export interface ViewInSourceFileRequest {
    (params: OptionalDocumentLocation): OptionalDocumentLocation | Promise<OptionalDocumentLocation>
}
export namespace ViewInSourceFileRequest {
    export const method = "64tass.ViewInSourceFile";
}

export type OptionalDocumentLocation = DocumentLocation | undefined | null;

export interface DocumentLocation {
    textDocument: TextDocumentIdentifier
    range: Range
}