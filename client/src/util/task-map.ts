import { Event, Task, TaskEndEvent, TaskExecution, TaskFilter, tasks as VStasks } from "vscode";

interface TasksAccessor {
    fetchTasks(filter?: TaskFilter): Thenable<Task[]>
	executeTask(task: Task): Thenable<TaskExecution>
    onDidEndTask: Event<TaskEndEvent>
}

export class TaskMapUtil {
    private tasks: TasksAccessor;

    private taskMap: Map<string, Task> = new Map();
    private isDirty: boolean = true;

    constructor(tasks: TasksAccessor) {
        this.tasks = tasks;
    }

    invalidateTasks(): void {
        this.isDirty = true;
    }

    async getTask(task: string): Promise<Task> {

        if (this.isDirty) {
            await this.reloadTasks();
            this.isDirty = false;
        }
        const r = this.taskMap.get(task);

        if (r === undefined) {
            throw new TaskNotDefinedError(task);
        }
        return r;
    }

    private async reloadTasks(): Promise<void> {

        const taskList = await this.tasks.fetchTasks();
        this.taskMap.clear();

        for (const task of taskList) {

            if (this.taskMap.get(task.name) === undefined) {
                this.taskMap.set(task.name, task);
            }
        }
    }
}

export const taskMapUtil = new TaskMapUtil(VStasks);

export class TaskNotDefinedError extends Error {
	constructor(task: string) {
		
		super(`The Task '${task}' is not defined`);
		this.name = "TaskNotDefinedError";
	}
}