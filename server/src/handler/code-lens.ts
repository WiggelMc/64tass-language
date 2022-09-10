import { _Connection, _, CodeLens, CodeLensParams, ServerRequestHandler, RequestHandler, Range, LSPObject, SemanticTokensRefreshRequest, Command } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const codeLensHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onCodeLens(onCodeLens);
        connection.onCodeLensResolve(onCodeLensResolve);
    },
    capabilities: {

        codeLensProvider: {
            resolveProvider: true
        },
    }
};

const onCodeLens: ServerRequestHandler<CodeLensParams, CodeLens[] | undefined | null, CodeLens[], void> =
async function(params, token, workDoneProgress, resultProgress) {
    console.log("CodeLens",params);
    const x: CodeLens = {
        range: Range.create(4,0,4,10),
        command: Command.create("HHEEEY","workbench.action.openSettingsJson")
    };
    return [
        x
    ];
};

const onCodeLensResolve: RequestHandler<CodeLens, CodeLens, void> =
async function(params, token) {
    console.log("CodeLensResolve",params);
    return CodeLens.create(Range.create(0,0,0,0));
};