import { _Connection, _, LinkedEditingRangeParams, LinkedEditingRanges, ServerRequestHandler, Range } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const linkedEditingRangeHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.languages.onLinkedEditingRange(onLinkedEditingRange);
    },
    capabilities: {

        linkedEditingRangeProvider: true
    }
};

const onLinkedEditingRange: ServerRequestHandler<LinkedEditingRangeParams, LinkedEditingRanges | undefined | null, never, never> = 
async function(params, token, workDoneProgress, resultProgress) {
    
    console.log("LinkedEditingRange: ", params);
    return {
        ranges: [
            Range.create(0,0,0,10),
            Range.create(1,0,1,10),
        ],
        wordPattern: ";0*"
    };
};

//html tag like editing