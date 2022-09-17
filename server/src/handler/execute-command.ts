import { ExecuteCommandParams, ServerRequestHandler, _, _Connection } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const executeCommandHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onExecuteCommand(onExecuteCommand);
    },
    capabilities: {

        executeCommandProvider: {
            commands: [
                //"64tass.assembleAndViewInList"
            ]
        }
    }
};

const onExecuteCommand: ServerRequestHandler<ExecuteCommandParams, any | undefined | null, never, void> = 
async function(params, token, workDoneProgress, resultProgress) {

    console.log("Execute Command: ", params);  
};

// Should only be used for actual server commands, which require no fixed client interaction