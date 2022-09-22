import { CancellationToken, ProviderResult, Task, TaskEndEvent, TaskProvider, tasks, TaskStartEvent } from "vscode";
import { TaskParams, TaskType } from "../common/capabilities/task";
import { ClientHandler } from "./handler";
import { setErrorShown } from "./terminal";
import { sendTaskEndRequest, sendTaskStartRequest } from "../server/task";

export const taskHandler: ClientHandler = {
    register(context) {
        return [
            tasks.onDidStartTask(onDidStartTask),
		    tasks.onDidEndTask(onDidEndTask),
			tasks.registerTaskProvider("shell", new TassTaskProvider())
        ];
    },
};

class TassTaskProvider implements TaskProvider<TassTask> {
	provideTasks(token: CancellationToken): ProviderResult<TassTask[]> {

		console.log("TaskProvider provide");
		return [];
	}
	resolveTask(task: TassTask, token: CancellationToken): ProviderResult<TassTask> {

		console.log("TaskProvider resolve");
		return task;
	}
}

class TassTask extends Task {

}

const runningTasks: Map<Task,boolean> = new Map();

const onDidStartTask: (e: TaskStartEvent) => any =
async function(e) {
	
	runningTasks.set(e.execution.task, true);

	const params: TaskParams = {
		task: e.execution.task.name
	};
	sendTaskStartRequest(params);
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
	sendTaskEndRequest(params).then( r => {

		if (r.type === TaskType.assemble || r.type === TaskType.assembleAndStart) {
			//this might reset errorShown after running if 'assembleAndStart' is an independent task
			//however, as the program should not be run when errors are present, this does not pose a problem
			setErrorShown(false);
		}
	});
};