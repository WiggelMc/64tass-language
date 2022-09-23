import { TaskFetchParams, TaskFetchRequest, OptionalTaskIdentifier, TaskIdentifier, TaskParams, TaskResult, TaskStartRequest, TaskEndRequest, TaskCommandFetchParams, TaskCommandIdentifier, OptionalTaskCommandIdentifier, TaskCommandFetchRequest } from "../common/capabilities/task";
import { client } from "../util/languageclient";


export async function sendTaskStartRequest(params: TaskParams): Promise<TaskResult> {

    return client.sendRequest(TaskStartRequest.method, params);
}

export async function sendTaskEndRequest(params: TaskParams): Promise<TaskResult> {

    return client.sendRequest(TaskEndRequest.method, params);
}

export async function sendTaskFetchRequest(params: TaskFetchParams): Promise<TaskIdentifier> {

    const r: OptionalTaskIdentifier = await client.sendRequest(TaskFetchRequest.method, params);

    if (r === undefined || r === null) {
        throw new Error("Task not defined");
    }

    return r;
}

export async function sendTaskCommandFetchRequest(params: TaskCommandFetchParams): Promise<TaskCommandIdentifier> {

    const r: OptionalTaskCommandIdentifier = await client.sendRequest(TaskCommandFetchRequest.method, params);

    if (r === undefined || r === null) {
        throw new Error("Command could not be created");
    }

    return r;
}