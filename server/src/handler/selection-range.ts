import { _Connection, _, SelectionRange, SelectionRangeParams, ServerRequestHandler } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const selectionRangeHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onSelectionRanges(onSelectionRanges);
    },
    capabilities: {
        
        selectionRangeProvider: true
    }
};

const onSelectionRanges: ServerRequestHandler<SelectionRangeParams, SelectionRange[] | undefined | null, SelectionRange[], void> =
async function(params, token, workDoneProgress, resultProgress) {
    console.log("SelectionRanges: ", params);

    return [];
};

// I have no idea what this does