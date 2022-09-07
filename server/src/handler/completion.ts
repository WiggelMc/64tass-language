import { CompletionItem, CompletionItemKind, CompletionList, CompletionParams, RequestHandler, ServerRequestHandler, _, _Connection } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const completionHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onCompletion(onCompletion);
        connection.onCompletionResolve(onCompletionResolve);
    },
    capabilities: {

        completionProvider: {
            resolveProvider: true
        }
    }
};

/**
 * This handler provides the initial list of the completion items.
 */
const onCompletion: ServerRequestHandler<CompletionParams, CompletionItem[] | CompletionList | undefined | null, CompletionItem[], void> =
async function(params, token, workDoneProgress, resultProgress) {
    
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.

    return [
        {
            label: 'TypeScript',
            kind: CompletionItemKind.Text,
            data: 1
        },
        {
            label: 'JavaScript',
            kind: CompletionItemKind.Text,
            data: 2
        }
    ];
};

/**
 * This handler resolves additional information for the item selected in
 * the completion list.
 */
const onCompletionResolve: RequestHandler<CompletionItem, CompletionItem, void> =
async function(item, token) {

    if (item.data === 1) {
        item.detail = 'TypeScript details';
        item.documentation = 'TypeScript documentation';
    } else if (item.data === 2) {
        item.detail = 'JavaScript details';
        item.documentation = 'JavaScript documentation';
    }
    return item;
};
