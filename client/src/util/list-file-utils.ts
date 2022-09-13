import { LanguageClient, Range } from "vscode-languageclient/node";
import * as vscode from "vscode";
import { OptionalDocumentLocation, ViewInListFileRequest, ViewInSourceFileRequest } from "../common/capabilities/list-file";

export async function sendViewInListFileRequest(client: LanguageClient, params: OptionalDocumentLocation): Promise<OptionalDocumentLocation> {

    return client.sendRequest(ViewInListFileRequest.method, params);
};

export async function sendViewInSourceFileRequest(client: LanguageClient, params: OptionalDocumentLocation): Promise<OptionalDocumentLocation> {

    return client.sendRequest(ViewInSourceFileRequest.method, params);
};

export function getCurrentDocumentLocation(): OptionalDocumentLocation {
    const editor = vscode.window.activeTextEditor;
		
    if (editor === undefined) {
        return undefined;
    }

    const params = {
        textDocument: {
            uri: editor.document.uri.toString()
        },
        range: Range.create(editor.selection.start, editor.selection.end)
    };

    return params;
}

export function gotoDocumentLocation(location: OptionalDocumentLocation) {

    vscode.workspace.openTextDocument(vscode.Uri.parse(location.textDocument.uri))
    .then(document => vscode.window.showTextDocument(document,vscode.ViewColumn.Active))
    .then(editor => {

        const range = location.range;

        const pos1 = new vscode.Position(range.start.line, range.start.character);
        const pos2 = new vscode.Position(range.end.line, range.end.character);

        editor.selection = new vscode.Selection(pos1, pos2);
        editor.revealRange(new vscode.Range(pos1.translate(-7),pos2.translate(7)), vscode.TextEditorRevealType.Default);
    });
}