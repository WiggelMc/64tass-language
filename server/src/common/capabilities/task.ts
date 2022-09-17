import { TextDocumentIdentifier } from "vscode-languageserver";

export interface TaskStartNotification {
    (params: TaskParams): void | Promise<void>
}
export namespace TaskStartNotification {
    export const method = "64tass.TaskStart";
}

export interface TaskEndNotification {
    (params: TaskParams): void | Promise<void>
}
export namespace TaskEndNotification {
    export const method = "64tass.TaskEnd";
}

export interface TaskParams {
    task: string
}

export interface TaskFetchRequest {
    (params: TaskFetchParams): TaskFetchResult | Promise<TaskFetchResult>
}
export namespace TaskFetchRequest {
    export const method = "64tass.TaskFetch";
}

export interface TaskFetchParams {
    textDocument: TextDocumentIdentifier,
    taskType: TaskType
}

export enum TaskType {
    assemble = 0,
    start = 1,
    assembleAndStart = 2
}

export interface TaskFetchResult {
    task: string
}