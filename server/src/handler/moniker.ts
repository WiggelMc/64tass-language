import { _Connection, _, ServerRequestHandler, Moniker, MonikerParams, UniquenessLevel, MonikerKind } from "vscode-languageserver";
import { Selector } from "../common/capabilities/document-selector";
import { ConnectionEventHandler } from "./handler";

export const monikerHandler: ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.languages.moniker.on(onMoniker);
    },
    capabilities: {
        
        monikerProvider: {
            documentSelector: Selector.all
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
            unique: UniquenessLevel.document,
            kind: MonikerKind.$import
        }
    ];
};

// I have no idea what this does
// it seems to allow some sort of virtual source document (would be good for instruction sets)