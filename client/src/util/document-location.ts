import { Range } from "vscode-languageclient/node";
import * as vscode from "vscode";
import { DocumentLocation } from "../common/capabilities/list-file";
import { sleep } from "./sleep";
import { config } from "../handler/config";

export async function getCurrentDocumentLocation(): Promise<DocumentLocation> {
    const editor = vscode.window.activeTextEditor;
		
    if (editor === undefined) {
        throw new Error("No Open Editor");
    }

    const params = {
        textDocument: {
            uri: editor.document.uri.toString()
        },
        range: Range.create(editor.selection.start, editor.selection.end)
    };

    return params;
}


let runningGotos: Map<number, boolean> = new Map();

export async function gotoDocumentLocationStoppable(location: DocumentLocation) {

    const id = Math.random();

    runningGotos.clear();
    runningGotos.set(id,true);

    let waitTime: number | undefined = config.get("assemble.error-wait-time");

    if (waitTime === undefined) {
        waitTime = 300;
    }

    if (waitTime > 0) {
        await sleep(waitTime);
    }

    if (!runningGotos.get(id)) {
        return;
    }

    return gotoDocumentLocation(location);
}

export async function gotoDocumentLocation(location: DocumentLocation) {
    return new Promise<void>((resolve, reject) => {

        runningGotos.clear();

        (async () => {})()
        .then(() => vscode.workspace.openTextDocument(vscode.Uri.parse(location.textDocument.uri)))
        .then(document => vscode.window.showTextDocument(document,vscode.ViewColumn.Active))
        .then(editor => {
    
            const range = location.range;
    
            const pos1 = new vscode.Position(range.start.line, range.start.character);
            const pos2 = new vscode.Position(range.end.line, range.end.character);
    
            editor.selection = new vscode.Selection(pos1, pos2);
            editor.revealRange(new vscode.Range(safeTranslate(pos1, -7), safeTranslate(pos2, 7)), vscode.TextEditorRevealType.Default);
        })
        .then(resolve)
        .catch(reject);
    });
}

function safeTranslate(pos: vscode.Position, lineDelta?: number, characterDelta?: number) {
    lineDelta ??= 0;
    characterDelta ??= 0;

    const line = Math.max(0, pos.line + lineDelta);
    const character = Math.max(0, pos.character + characterDelta);

    return new vscode.Position(line, character);
}