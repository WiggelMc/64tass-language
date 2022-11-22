import { Event, Task, TaskEndEvent, TaskExecution, TaskFilter, tasks as VStasks } from "vscode";

export const TASKS_CONFIG_CATEGORY = "tasks";

interface TasksAccessor {
    fetchTasks(filter?: TaskFilter): Thenable<Task[]>
	executeTask(task: Task): Thenable<TaskExecution>
    onDidEndTask: Event<TaskEndEvent>
}

export class TaskUtil {
    tasks: TasksAccessor;

    constructor(tasks: TasksAccessor) {
        this.tasks = tasks;
    }

    async runTask(task: Task): Promise<void> {

        return new Promise(async (resolve, reject) => {

            const listener = this.tasks.onDidEndTask((e) => {
                if (task === e.execution.task) {
                    resolve();
                    listener?.dispose();
                }
            });

            await this.tasks.executeTask(task);
        });
    }
}

export const taskUtil = new TaskUtil(VStasks);