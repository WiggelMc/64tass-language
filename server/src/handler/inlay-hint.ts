import { _Connection, _, InlayHint, InlayHintParams, ServerRequestHandler, RequestHandler, Position, InlayHintKind, Range, Location } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const inlayHintHander : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.languages.inlayHint.on(onInlayHint);
        connection.languages.inlayHint.resolve(onInlayHintResolve);
    },
    capabilities: {

        inlayHintProvider: {
            resolveProvider: false
        }
    }
};

const onInlayHint: ServerRequestHandler<InlayHintParams, InlayHint[] | undefined | null, InlayHint[], void> =
async function(params, token, workDoneProgress, resultProgress) {
    console.log("Inlay Hints: ", params);

    const f = (n: number) : InlayHint => {
        return {
            position: Position.create(n,0),
            label: [
                {
                    value: "Label 10",
                }
            ],
            paddingLeft: true,
            paddingRight: true,
            kind: InlayHintKind.Type
        };
    };

    const startLine = params.range.start.line;
    const endLine = params.range.end.line;

    const r = new Array();
    for (let index = startLine; index <= endLine; index++) {
        r.push(f(index));
    }

    return r;
};

const onInlayHintResolve: RequestHandler<InlayHint, InlayHint, void> =
async function(params, token) {
    return InlayHint.create(Position.create(9,10),"Label 10", InlayHintKind.Type);
};