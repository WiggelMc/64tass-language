import { Task } from "vscode";

export class RunningTaskUtil {
    runningTasks: Set<Task> = new Set();

    constructor() {

    }

    registerStartedTask(task: Task) {
        this.runningTasks.add(task);
    }

    deregisterEndedTask(task: Task): boolean {
        return this.runningTasks.delete(task);
    }
}

export const runningTaskUtil = new RunningTaskUtil();