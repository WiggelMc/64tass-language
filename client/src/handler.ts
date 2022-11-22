import { Disposable, ExtensionContext } from "vscode";
import { commandHandler } from "./handler/command";
import { configHandler } from "./handler/config";
import { executeHandler } from "./handler/execute";
import { listFileHandler } from "./handler/list-file";
import { taskHandler } from "./handler/task";
import { terminalHandler } from "./handler/terminal";

export interface ClientHandler {
    register: (context: ExtensionContext) => Disposable[];
}

const handlers: ClientHandler[] = [
    executeHandler,
    listFileHandler,
    commandHandler,
    taskHandler,
    configHandler,
    terminalHandler,
];

export function registerClientHandlers(context: ExtensionContext) {
    const disposables: Disposable[] = [];

    for (const handler of handlers) {
        disposables.push(
            ...handler.register(context)
        );
    }

    context.subscriptions.push(...disposables);
}