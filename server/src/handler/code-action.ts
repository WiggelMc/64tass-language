import { _Connection, _, CodeActionKind, CodeAction, CodeActionParams, Command, RequestHandler, ServerRequestHandler } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const codeActionHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onCodeAction(onCodeAction);
        connection.onCodeActionResolve(onCodeActionResolve);
    },
    capabilities: {

        codeActionProvider: {
            codeActionKinds: [
                CodeActionKind.Source,
                CodeActionKind.Refactor,
                CodeActionKind.QuickFix
            ],
            resolveProvider: true
        }
    }
};

const onCodeAction: ServerRequestHandler<CodeActionParams, (Command | CodeAction)[] | undefined | null, (Command | CodeAction)[], void> =
async function(params, token, workDoneProgress, resultProgress) {

    console.log("CodeAction: ", params);
    return [];
};

const onCodeActionResolve: RequestHandler<CodeAction, CodeAction, void> =
async function(params, token) {

    console.log("CodeAction Resolve: ", params);
    return CodeAction.create("lohl");
};