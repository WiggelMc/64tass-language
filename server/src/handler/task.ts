import { _Connection, _, TextDocumentSyncKind, TextDocumentFilter } from "vscode-languageserver";
import { OptionalTaskIdentifier, TaskCommandFetchRequest, TaskCommandType, TaskEndRequest, TaskFetchRequest, TaskStartRequest, TaskType } from "../common/capabilities/task";
import { ConnectionEventHandler } from "./handler";

export const taskHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onRequest(TaskStartRequest.method, onTaskStart);
        connection.onRequest(TaskEndRequest.method, onTaskEnd);
        connection.onRequest(TaskFetchRequest.method, onTaskFetch);
        connection.onRequest(TaskCommandFetchRequest.method, onTaskCommandFetch);
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

const onTaskCommandFetch: TaskCommandFetchRequest =
async function(params) {

    console.log("Fetch Task: ", params);

    if (params.taskCommandType === TaskCommandType.commandLineCommand) {
        return {
            command: "CMD: " + params.textDocument.uri
        };
    } else {
        return {
            command: "JSON: " + params.textDocument.uri
        };
    }
};

const onTaskFetch: TaskFetchRequest =
async function(params) {

    console.log("Fetch Task: ", params);

    return getTask(params.taskType);
};

function getTask(type: TaskType): OptionalTaskIdentifier {
    const taskName = getTaskName(type);

    if (taskName === undefined) {
        return undefined;
    }

    return {
        task: taskName
    };
}

function getTaskName(type: TaskType): string | undefined {
    switch (type) {
        case TaskType.assemble:
            return "Assemble";
        case TaskType.assembleAndStart:
            return "Assemble and Start";
        case TaskType.start:
            return "Start";
        default:
            return undefined;
    }
}

function getTaskType(task: string): TaskType {
    switch (task) {
        case "Assemble":
        case "Assemble A":
        case "Goat Process":
        case "Goat Shell":
            return TaskType.assemble;
        case "Assemble and Start":
            return TaskType.assembleAndStart;
        case "Start":
            return TaskType.start;
        default:
            return TaskType.unknown;
    }
}