import { TextDocumentIdentifier } from "vscode-languageclient";

export interface AssembleTaskRequest {
    (params: AssembleTaskParams): AssembleTaskResult | Promise<AssembleTaskResult>
}
export namespace AssembleTaskRequest {
    export const method = "64tass.AssembleTask";
}

export interface AssembleTaskParams {
    textDocument: TextDocumentIdentifier
}

export interface AssembleTaskResult {
    task: string
}