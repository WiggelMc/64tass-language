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