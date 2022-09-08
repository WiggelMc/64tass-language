import { _Connection, _, ServerRequestHandler, Moniker, MonikerParams, UniquenessLevel } from "vscode-languageserver";
import { selector } from "../document-selector";
import { ConnectionEventHandler } from "./handler";

export const monikerHandler: ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.languages.moniker.on(onMoniker);
    },
    capabilities: {
        
        monikerProvider: {
            documentSelector: selector
        }
    }
};

const onMoniker: ServerRequestHandler<MonikerParams, Moniker[] | null, Moniker[], void> = 
async function(params, token, workDoneProgress, resultProgress) {

    console.log("Moniker: ",params.position);
    return [
        {
            scheme: "tsc",
            identifier: "test",
            unique: UniquenessLevel.document
        }
    ];
};