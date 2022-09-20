import { Disposable, ExtensionContext } from "vscode";

export interface ClientInitHandler {
    register: (context: ExtensionContext) => Disposable[];
}