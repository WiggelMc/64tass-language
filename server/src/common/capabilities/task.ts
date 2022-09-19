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
    type: TaskType;
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

export type TaskType = number;

export namespace TaskType {
    export const unknown = 0;
    export const assemble = 1;
    export const start = 2;
    export const assembleAndStart = 3;
    export const customTaskOf = (n: number) => n + 100;
    export const customTaskToArrayIndex = (n: TaskType) => n - 101;
}

export interface TaskFetchResult {
    task: string
}