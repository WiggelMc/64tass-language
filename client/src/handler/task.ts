import { Task, TaskEndEvent, tasks, TaskStartEvent } from "vscode";
import { TaskEndRequest, TaskParams, TaskResult, TaskStartRequest, TaskType } from "../common/capabilities/task";
import { ClientHandler } from "./handler";
import { client } from "../util/languageclient";
import { setErrorShown } from "./terminal";

export const taskHandler: ClientHandler = {
    register(context) {
        return [
            tasks.onDidStartTask(onDidStartTask),
		    tasks.onDidEndTask(onDidEndTask),
        ];
    },
};

const runningTasks: Map<Task,boolean> = new Map();

const onDidStartTask: (e: TaskStartEvent) => any =
async function(e) {
	
	runningTasks.set(e.execution.task, true);

	const params: TaskParams = {
		task: e.execution.task.name
	};
	client.sendRequest(TaskStartRequest.method, params);
};

const onDidEndTask: (e: TaskEndEvent) => any =
async function(e) {

	if (!runningTasks.has(e.execution.task)) {
		return;
	}
	runningTasks.delete(e.execution.task);

	const params: TaskParams = {
		task: e.execution.task.name
	};
	client.sendRequest(TaskEndRequest.method, params).then((r: TaskResult) => {

		if (r.type === TaskType.assemble || r.type === TaskType.assembleAndStart) {
			//this might reset errorShown after running if 'assembleAndStart' is an independent task
			//however, as the program should not be run when errors are present, this does not pose a problem
			setErrorShown(false);
		}
	});
};