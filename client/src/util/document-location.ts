import { Range, TextDocumentIdentifier } from "vscode-languageclient/node";
import * as vscode from "vscode";
import { DocumentLocation } from "../common/capabilities/list-file";
import { sleep } from "./sleep";

export async function getCurrentDocumentLocation(): Promise<DocumentLocation> {
    const editor = vscode.window.activeTextEditor;

    if (editor === undefined) {
        throw new NoOpenEditorError();
    }

    const params = {
        textDocument: {
            uri: editor.document.uri.toString()
        },
        range: Range.create(editor.selection.start, editor.selection.end)
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

async function openTextDocument(textDocument: TextDocumentIdentifier) {

    return vscode.workspace.openTextDocument(
        vscode.Uri.parse(textDocument.uri)
    );
}

async function showTextDocument(document: vscode.TextDocument) {

    return vscode.window.showTextDocument(document, vscode.ViewColumn.Active);
}

async function showRangeInEditor(editor: vscode.TextEditor, range: Range) {

    const pos1 = new vscode.Position(range.start.line, range.start.character);
    const pos2 = new vscode.Position(range.end.line, range.end.character);

    editor.selection = new vscode.Selection(pos1, pos2);
    editor.revealRange(new vscode.Range(safeTranslate(pos1, -7), safeTranslate(pos2, 7)), vscode.TextEditorRevealType.Default);
}

function safeTranslate(pos: vscode.Position, lineDelta: number = 0, characterDelta: number = 0) {

    const line = Math.max(0, pos.line + lineDelta);
    const character = Math.max(0, pos.character + characterDelta);

    return new vscode.Position(line, character);
}

class NoOpenEditorError extends Error {
    constructor() {

        super(`The Editor is not open`);
        this.name = "NoOpenEditorError";
    }
}