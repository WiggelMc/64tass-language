import { Task, tasks } from "vscode";

const taskMap: Map<string, Task> = new Map();
let isDirty: boolean = true;

export function invalidateTasks(): void {
    isDirty = true;
}

export async function getTask(task: string): Promise<Task> {

    if (isDirty) {
        await reloadTasks();
        isDirty = false;
    }
    const r = taskMap.get(task);

    if (r === undefined) {
        throw new TaskNotDefinedError(task);
    }
    return r;
}

async function reloadTasks(): Promise<void> {

    const taskList = await tasks.fetchTasks();
    taskMap.clear();

    for (const task of taskList) {

        if (taskMap.get(task.name) === undefined) {
            taskMap.set(task.name, task);
        }
    }
}

export async function runTask(task: Task): Promise<void> {

    return new Promise(async (resolve, reject) => {

        const listener = tasks.onDidEndTask((e) => {
            if (task === e.execution.task) {
                resolve();
                listener?.dispose();
            }
        });

        await tasks.executeTask(task);
    });
}

class TaskNotDefinedError extends Error {
	constructor(task: string) {
		
		super(`The Task '${task}' is not defined`);
		this.name = "TaskNotDefinedError";
	}
}