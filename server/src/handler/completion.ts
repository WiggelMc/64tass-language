import { CompletionItem, CompletionItemKind, CompletionList, CompletionParams, RequestHandler, ServerRequestHandler } from "vscode-languageserver";

/**
 * This handler provides the initial list of the completion items.
 */
export const onCompletion: ServerRequestHandler<CompletionParams, CompletionItem[] | CompletionList | undefined | null, CompletionItem[], void> =
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
export const onCompletionResolve: RequestHandler<CompletionItem, CompletionItem, void> =
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
