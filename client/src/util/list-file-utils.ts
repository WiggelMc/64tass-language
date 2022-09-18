import { LanguageClient, Range, uinteger } from "vscode-languageclient/node";
import * as vscode from "vscode";
import { DocumentLocation, OptionalDocumentLocation, ViewInListFileRequest, ViewInSourceFileRequest } from "../common/capabilities/list-file";

export async function sendViewInListFileRequest(client: LanguageClient, params: DocumentLocation): Promise<DocumentLocation> {

    const r: OptionalDocumentLocation = await client.sendRequest(ViewInListFileRequest.method, params);

    if (r === undefined || r === null) {
        throw new Error("List File not Found");
    }

    return r;
};

export async function sendViewInSourceFileRequest(client: LanguageClient, params: DocumentLocation): Promise<DocumentLocation> {

    const r: OptionalDocumentLocation = await client.sendRequest(ViewInSourceFileRequest.method, params);

    if (r === undefined || r === null) {
        throw new Error("Source File not Found");
    }

    return r;
};

export function getCurrentDocumentLocation(): DocumentLocation {
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

export function gotoDocumentLocation(location: DocumentLocation) {

    console.log("GOTO");

    vscode.workspace.openTextDocument(vscode.Uri.parse(location.textDocument.uri))
    .then(document => vscode.window.showTextDocument(document,vscode.ViewColumn.Active))
    .then(editor => {

        const range = location.range;

        const pos1 = new vscode.Position(range.start.line, range.start.character);
        const pos2 = new vscode.Position(range.end.line, range.end.character);

        editor.selection = new vscode.Selection(pos1, pos2);
        editor.revealRange(new vscode.Range(safeTranslate(pos1, -7), safeTranslate(pos2, 7)), vscode.TextEditorRevealType.Default);
    });
}

function safeTranslate(pos: vscode.Position, lineDelta?: number, characterDelta?: number) {
    lineDelta ??= 0;
    characterDelta ??= 0;

    const line = Math.max(0, pos.line + lineDelta);
    const character = Math.max(0, pos.character + characterDelta);

    return new vscode.Position(line, character);
}