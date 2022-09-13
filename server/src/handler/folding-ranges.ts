import { _Connection, _, FoldingRange, FoldingRangeParams, ServerRequestHandler } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const foldingRangeHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
 
        connection.onFoldingRanges(onFoldingRanges);
    },
    capabilities: {

        foldingRangeProvider: true
    }
};

const onFoldingRanges: ServerRequestHandler<FoldingRangeParams, FoldingRange[] | undefined | null, FoldingRange[], void> =
async function(params, token, workDoneProgress, resultProgress) {

    console.log("Folding Ranges: ", params);
    return [
        FoldingRange.create(20,100)
    ];
};