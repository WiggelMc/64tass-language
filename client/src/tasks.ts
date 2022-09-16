import { resolve } from "path";
import { Disposable, Task, tasks } from "vscode";

export class TaskMap {
    private static map: Map<string, Task> = new Map();
    private static isDirty: boolean = true;

    public static invalidate(): void {
        this.isDirty = true;
    }

    public static async getTask(task: string): Promise<Task | undefined> {

        if (this.isDirty) {
            await this.reloadTasks();
            this.isDirty = false;
        }
        return this.map.get(task);
    }

    public static async reloadTasks(): Promise<void> {

        const taskList = await tasks.fetchTasks();
        this.map.clear();

        for (const task of taskList) {

            if (this.map.get(task.name) === undefined) {
                this.map.set(task.name, task);
            }
        }
    }
}

export async function runTask(task: Task): Promise<void> {

    return new Promise(async (resolve, reject) => {

        const listener = tasks.onDidEndTask((e) => {
            console.log("Listener Execution");
            if (task === e.execution.task) {
                console.log("Task has ended");
                resolve();
                listener?.dispose();
            }
        });

        await tasks.executeTask(task);
    });
}