import { ServerCapabilities, _, _Connection } from "vscode-languageserver";

export interface ConnectionEventHandler {
    register: (connection: _Connection<_, _, _, _, _, _, _>) => void;
    capabilities: ServerCapabilities<any>;
}