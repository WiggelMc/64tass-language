import { _Connection, _, TextDocumentSyncKind, TextDocumentFilter } from "vscode-languageserver";
import { TaskEndRequest, TaskFetchRequest, TaskStartRequest, TaskType } from "../common/capabilities/task";
import { ConnectionEventHandler } from "./handler";

export const taskHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onRequest(TaskStartRequest.method, onTaskStart);
        connection.onRequest(TaskEndRequest.method, onTaskEnd);
        connection.onRequest(TaskFetchRequest.method, onTaskFetch);
    }
};

const onTaskStart: TaskStartRequest =
async function(params) {

    console.log("Task Start: ", params);
    return {
        type: getTaskType(params.task)
    };
};

const onTaskEnd: TaskEndRequest =
async function(params) {

    console.log("Task End: ", params);
    return {
        type: getTaskType(params.task)
    };
};

const onTaskFetch: TaskFetchRequest =
async function(params) {

    console.log("Fetch Task: ", params);
    return {
        task: getTask(params.taskType)
    };
};

function getTask(type: TaskType): string {
    switch (type) {
        case TaskType.assemble:
            return "Assemble";
        case TaskType.assembleAndStart:
            return "Assemble and Start";
        case TaskType.start:
            return "Start";
    }
}

function getTaskType(task: string): TaskType | undefined {
    switch (task) {
        case "Assemble":
            return TaskType.assemble;
        case "Assemble and Start":
            return TaskType.assembleAndStart;
        case "Start":
            return TaskType.start;
        default:
            return undefined;
    }
}