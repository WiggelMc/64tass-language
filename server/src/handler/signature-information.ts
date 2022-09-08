import { _Connection, _, ServerRequestHandler, SignatureHelp, SignatureHelpParams, SignatureInformation } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const signatureInformationHandler: ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onSignatureHelp(onSignatureHelp);
    },
    capabilities: {

        signatureHelpProvider: {
            triggerCharacters: [
                "(",
                " "
            ],
            retriggerCharacters: [
                ","
            ]
        }
    }
};

const onSignatureHelp: ServerRequestHandler<SignatureHelpParams, SignatureHelp | undefined | null, never, void> =
async function(params, token, workDoneProgress, resultProgress) {
    
    if (params.position.line !== 1) {
        return undefined;
    }
    return {
        signatures: [
            SignatureInformation.create("peter", "doc", {label: "a1"})
        ],
        activeSignature: 0,
        activeParameter: 0
    };
};