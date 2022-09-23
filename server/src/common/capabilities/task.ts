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
    (params: TaskFetchParams): OptionalTaskIdentifier | Promise<OptionalTaskIdentifier>
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

export type OptionalTaskIdentifier = TaskIdentifier | undefined | null;

export interface TaskIdentifier {
    task: string
}

export interface TaskCommandFetchRequest {
    (params: TaskCommandFetchParams): OptionalTaskCommandIdentifier | Promise<OptionalTaskCommandIdentifier>
}
export namespace TaskCommandFetchRequest {
    export const method = "64tass.TaskCommandFetch";
}

export interface TaskCommandFetchParams {
    textDocument: TextDocumentIdentifier,
    taskCommandType: TaskCommandType
}

export enum TaskCommandType {
    processTask,
    commandLineCommand
}

export type OptionalTaskCommandIdentifier = TaskCommandIdentifier | undefined | null;

export interface TaskCommandIdentifier {
    command: string
}