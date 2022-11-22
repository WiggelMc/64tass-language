import { TaskEndEvent, tasks, TaskStartEvent } from "vscode";
import { TaskParams, TaskType } from "../common/capabilities/task";
import { ClientHandler } from "../handler";
import { sendTaskEndRequest, sendTaskStartRequest } from "../server/task";
import { errorPositionUtil } from "../util/error-position";
import { runningTaskUtil } from "../util/running-task";

export const taskHandler: ClientHandler = {
	register(context) {
		return [
			tasks.onDidStartTask(onDidStartTask),
			tasks.onDidEndTask(onDidEndTask),
		];
	},
};

const onDidStartTask: (e: TaskStartEvent) => any =
	async function (e) {

		runningTaskUtil.registerStartedTask(e.execution.task);

		const params: TaskParams = {
			task: e.execution.task.name
		};
		sendTaskStartRequest(params);
	};

const onDidEndTask: (e: TaskEndEvent) => any =
	async function (e) {

		if (!runningTaskUtil.deregisterEndedTask(e.execution.task)) {
			return;
		}

		const params: TaskParams = {
			task: e.execution.task.name
		};
		sendTaskEndRequest(params).then(r => {

			if (r.type === TaskType.assemble || r.type === TaskType.assembleAndStart) {
				//this might reset errorShown after running if 'assembleAndStart' is an independent task
				//however, as the program should not be run when errors are present, this does not pose a problem
				errorPositionUtil.resetErrorJumping();
			}
		});
	};