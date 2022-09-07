import { _Connection, _, HoverParams, ServerRequestHandler, Hover, MarkupKind } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const hoverHandler: ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onHover(onHover);
    },
    capabilities: {

        hoverProvider: true
    }
};

const onHover: ServerRequestHandler<HoverParams, Hover | undefined | null, never, void> =
async function(params, token, workDoneProgress, resultProgress) {
    
    if (params.position.line !== 0) {
        return undefined;
    }
    return {
        contents: {
            kind: MarkupKind.Markdown,
            value: "**TEST**"
        }
    };
};