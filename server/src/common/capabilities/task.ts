import { TextDocumentIdentifier } from "vscode-languageserver";

export interface TaskStartRequest {
    (params: TaskParams): TaskResult | Promise<TaskResult>
}
export namespace TaskStartRequest {
    export const method = "64tass.TaskStart";
}

export interface TaskEndRequest {
    (params: TaskParams): TaskResult | Promise<TaskResult>
}
export namespace TaskEndRequest {
    export const method = "64tass.TaskEnd";
}

export interface TaskParams {
    task: string
}

export interface TaskResult {
    type?: TaskType;
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