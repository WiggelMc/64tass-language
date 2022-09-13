import { DocumentSelector } from "vscode-languageclient";

export namespace Selector {

    export const source: DocumentSelector = [
        {
            scheme: "file",
            language: "64tass"
        }
    ];
    export const list: DocumentSelector = [
        {
            scheme: "file",
            language: "64tasslist"
        }
    ];
    export const all: DocumentSelector = [...source, ...list];
}

export const configFilename = "64tasslang.json";