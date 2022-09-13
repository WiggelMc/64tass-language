import { Range, TextDocumentIdentifier } from "vscode-languageserver";

export interface ListFileLocationRequest {
    (params: ListFileLocationParams): ListFileLocation | Promise<ListFileLocation>
}

export namespace ListFileLocationRequest {
    export const method = "ListFileLocation";
}

export interface ListFileLocationParams {
    textDocument: TextDocumentIdentifier
    range: Range
}

export interface ListFileLocation {
    textDocument: TextDocumentIdentifier
    range: Range
}