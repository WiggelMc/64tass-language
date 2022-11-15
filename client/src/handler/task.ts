import { Task, TaskEndEvent, tasks, TaskStartEvent } from "vscode";
import { TaskParams, TaskType } from "../common/capabilities/task";
import { ClientHandler } from "./handler";
import { resetTaskLinterDiagnostics } from "./terminal";
import { sendTaskEndRequest, sendTaskStartRequest } from "../server/task";

export const taskHandler: ClientHandler = {
	register(context) {
		return [
			tasks.onDidStartTask(onDidStartTask),
			tasks.onDidEndTask(onDidEndTask),
		];
	},
};

const runningTasks: Set<Task> = new Set();

const onDidStartTask: (e: TaskStartEvent) => any =
	async function (e) {

		runningTasks.add(e.execution.task);

		const params: TaskParams = {
			task: e.execution.task.name
		};
		sendTaskStartRequest(params);
	};

const onDidEndTask: (e: TaskEndEvent) => any =
	async function (e) {

		if (!runningTasks.delete(e.execution.task)) {
			return;
		}

		const params: TaskParams = {
			task: e.execution.task.name
		};
		sendTaskEndRequest(params).then(r => {

			if (r.type === TaskType.assemble || r.type === TaskType.assembleAndStart) {
				//this might reset errorShown after running if 'assembleAndStart' is an independent task
				//however, as the program should not be run when errors are present, this does not pose a problem
				resetTaskLinterDiagnostics();
			}
		});
	};