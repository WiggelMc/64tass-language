import { _Connection, _, TextDocumentSyncKind, TextDocumentFilter } from "vscode-languageserver";
import { TaskEndNotification, TaskStartNotification } from "../common/capabilities/task";
import { ConnectionEventHandler } from "./handler";

export const taskHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onNotification(TaskStartNotification.method, onTaskStart);
        connection.onNotification(TaskEndNotification.method, onTaskEnd);
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