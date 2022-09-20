import { TaskFetchParams, TaskFetchRequest, OptionalTaskIdentifier, TaskIdentifier } from "../common/capabilities/task";
import { client } from "../util/languageclient";


export async function sendTaskFetchRequest(params: TaskFetchParams): Promise<TaskIdentifier> {

    const r: OptionalTaskIdentifier = await client.sendRequest(TaskFetchRequest.method, params);

    if (r === undefined || r === null) {
        throw new Error("Task not defined");
    }

    return r;
}
