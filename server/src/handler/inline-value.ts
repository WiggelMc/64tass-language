import { _Connection, _, ServerRequestHandler, InlineValue, InlineValueParams } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const inlineValueHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.languages.inlineValue.on(onInlineValue);
    },
    capabilities: {

        inlineValueProvider: true
    }
};

const onInlineValue: ServerRequestHandler<InlineValueParams, InlineValue[] | undefined | null, InlineValue[], void> =
async function(params, token, workDoneProgress, resultProgress) {
    console.log("inline");
    return [];
};

//seems to only work in debug mode