export interface ListFileLocationRequest {
    (params: ListFileLocationParams): any
}

export namespace ListFileLocationRequest {
    export const method = "ListFileLocation";
}

interface ListFileLocationParams {
    textDocument: any //TextDocumentIdentifier
    range: any //Range
}