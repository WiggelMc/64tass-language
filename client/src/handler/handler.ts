import { Disposable, ExtensionContext } from "vscode";
import { commandHandler } from "./command";
import { configHandler } from "./config";
import { executeHandler } from "./execute";
import { listFileHandler } from "./list-file";
import { taskHandler } from "./task";
import { terminalHandler } from "./terminal";

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