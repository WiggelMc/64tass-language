import { TextEditor, window as VSwindow } from "vscode";
import { Range as ClientRange } from "vscode-languageclient/node";
import { DocumentLocation } from "../common/capabilities/list-file";

interface WindowAccessor {
    readonly activeTextEditor: TextEditor | undefined
}

export class CurrentDocumentLocationUtil {
    private window: WindowAccessor;

    constructor(window: WindowAccessor) {

        this.window = window;
    }


    async getCurrentDocumentLocation(): Promise<DocumentLocation> {
        const editor = this.window.activeTextEditor;
    
        if (editor === undefined) {
            throw new NoOpenEditorError();
        }
    
        const params = {
            textDocument: {
                uri: editor.document.uri.toString()
            },
            range: ClientRange.create(editor.selection.start, editor.selection.end)
        };
    
        return params;
    }
}

export const currentDocumentLocationUtil = new CurrentDocumentLocationUtil(VSwindow);

export class NoOpenEditorError extends Error {
    constructor() {

        super(`The Editor is not open`);
        this.name = "NoOpenEditorError";
    }
}