import { Event, ExtensionContext, TaskEndEvent, tasks as VStasks, TaskStartEvent } from "vscode";
import { TaskParams, TaskType } from "../common/capabilities/task";
import { ClientHandler } from "../handler";
import { sendTaskEndRequest, sendTaskStartRequest } from "../server/task";
import { ErrorPositionUtil, errorPositionUtil } from "../util/error-position";
import { RunningTaskUtil, runningTaskUtil } from "../util/running-task";



interface TasksAccessor {
	onDidStartTask: Event<TaskStartEvent>
	onDidEndTask: Event<TaskEndEvent>
}

class TaskHandler implements ClientHandler {
	private tasks: TasksAccessor;
	private runningTask: RunningTaskUtil;
	private errorPosition: ErrorPositionUtil;

	constructor(tasks: TasksAccessor, runningTask: RunningTaskUtil, errorPosition: ErrorPositionUtil) {
		this.tasks = tasks;
		this.runningTask = runningTask;
		this.errorPosition = errorPosition;
	}

	register(context: ExtensionContext) {
		return [
			this.tasks.onDidStartTask(this.onDidStartTask),
			this.tasks.onDidEndTask(this.onDidEndTask),
		];
	}
	
	async onDidStartTask(e: TaskStartEvent) {

		this.runningTask.registerStartedTask(e.execution.task);

		const params: TaskParams = {
			task: e.execution.task.name
		};
		sendTaskStartRequest(params);
	}
	
	async onDidEndTask(e: TaskEndEvent) {

		if (!this.runningTask.deregisterEndedTask(e.execution.task)) {
			return;
		}

		const params: TaskParams = {
			task: e.execution.task.name
		};
		sendTaskEndRequest(params).then(r => {

			if (r.type === TaskType.assemble || r.type === TaskType.assembleAndStart) {
				//this might reset errorShown after running if 'assembleAndStart' is an independent task
				//however, as the program should not be run when errors are present, this does not pose a problem
				this.errorPosition.resetErrorJumping();
			}
		});
	}
}

export const taskHandler = new TaskHandler(VStasks, runningTaskUtil, errorPositionUtil); 