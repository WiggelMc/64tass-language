import { Position, Range, Selection, TextDocument, TextEditor, TextEditorRevealType, Uri, ViewColumn, workspace as VSworkspace, window as VSwindow } from "vscode";
import { Range as ClientRange, TextDocumentIdentifier as ClientTextDocumentIdentifier } from "vscode-languageclient/node";
import { DocumentLocation } from "../common/capabilities/list-file";
import { sleep } from "./sleep";

const EDITOR_RANGE_LINE_PADDING = 7;

interface WorkspaceAccessor {
    openTextDocument(uri: Uri): Thenable<TextDocument>
}

interface WindowAccessor {
    showTextDocument(document: TextDocument, column?: ViewColumn, preserveFocus?: boolean): Thenable<TextEditor>
}

export class DocumentLocationUtil {
    private workspace: WorkspaceAccessor;
    private window: WindowAccessor;

    private currentRunning: object;

    constructor(workspace: WorkspaceAccessor, window: WindowAccessor) {
		this.workspace = workspace;
		this.window = window;
	}
    
    async gotoDocumentLocationStoppable(location: DocumentLocation, waitTime: number) {
    
        const instance = {};
        this.currentRunning = instance;
    
        if (waitTime > 0) {
            await sleep(waitTime);
        }
    
        if (this.currentRunning === instance) {
            this.gotoDocumentLocation(location);
        }
    }
    
    async gotoDocumentLocation(location: DocumentLocation) {
        this.currentRunning = undefined;
    
        this.openTextDocument(location.textDocument)
            .then(this.showTextDocument)
            .then(editor => showRangeInEditor(editor, location.range));
    }
    
    private async openTextDocument(textDocument: ClientTextDocumentIdentifier) {
    
        return this.workspace.openTextDocument(
            Uri.parse(textDocument.uri)
        );
    }
    
    private async showTextDocument(document: TextDocument) {
    
        return this.window.showTextDocument(document, ViewColumn.Active);
    }
}

export const documentLocationUtil = new DocumentLocationUtil(VSworkspace, VSwindow);


async function showRangeInEditor(editor: TextEditor, range: ClientRange) {

    const pos1 = new Position(range.start.line, range.start.character);
    const pos2 = new Position(range.end.line, range.end.character);

    editor.selection = new Selection(pos1, pos2);
    editor.revealRange(new Range(safeTranslate(pos1, -EDITOR_RANGE_LINE_PADDING), safeTranslate(pos2, EDITOR_RANGE_LINE_PADDING)), TextEditorRevealType.Default);
}

function safeTranslate(pos: Position, lineDelta = 0, characterDelta = 0) {

    const line = Math.max(0, pos.line + lineDelta);
    const character = Math.max(0, pos.character + characterDelta);

    return new Position(line, character);
}