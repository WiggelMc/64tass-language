import { _Connection, _, TextDocumentSyncKind, TextDocumentFilter } from "vscode-languageserver";
import { TaskEndNotification, TaskFetchRequest, TaskStartNotification, TaskType } from "../common/capabilities/task";
import { ConnectionEventHandler } from "./handler";

export const taskHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onNotification(TaskStartNotification.method, onTaskStart);
        connection.onNotification(TaskEndNotification.method, onTaskEnd);
        connection.onRequest(TaskFetchRequest.method, onTaskFetch);
    }
};

const onTaskStart: TaskStartNotification =
async function(params) {

    console.log("Task Start: ", params);
};

const onTaskEnd: TaskEndNotification =
async function(params) {

    console.log("Task End: ", params);
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