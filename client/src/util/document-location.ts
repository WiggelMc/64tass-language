import { Position, Range, Selection, TextDocument, TextEditor, TextEditorRevealType, Uri, ViewColumn, window, workspace } from "vscode";
import { Range as ClientRange, TextDocumentIdentifier as ClientTextDocumentIdentifier } from "vscode-languageclient/node";
import { DocumentLocation } from "../common/capabilities/list-file";
import { sleep } from "./sleep";

const EDITOR_RANGE_LINE_PADDING = 7;

export async function getCurrentDocumentLocation(): Promise<DocumentLocation> {
    const editor = window.activeTextEditor;

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


let currentRunning: object;

export async function gotoDocumentLocationStoppable(location: DocumentLocation, waitTime: number) {

    const instance = {};
    currentRunning = instance;

    if (waitTime > 0) {
        await sleep(waitTime);
    }

    if (currentRunning === instance) {
        gotoDocumentLocation(location);
    }
}

export async function gotoDocumentLocation(location: DocumentLocation) {
    currentRunning = undefined;

    openTextDocument(location.textDocument)
        .then(showTextDocument)
        .then(editor => showRangeInEditor(editor, location.range));
}

async function openTextDocument(textDocument: ClientTextDocumentIdentifier) {

    return workspace.openTextDocument(
        Uri.parse(textDocument.uri)
    );
}

async function showTextDocument(document: TextDocument) {

    return window.showTextDocument(document, ViewColumn.Active);
}

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

export class NoOpenEditorError extends Error {
    constructor() {

        super(`The Editor is not open`);
        this.name = "NoOpenEditorError";
    }
}