

export namespace Selector {

    export const source = [
        {
            scheme: "file",
            language: "64tass"
        }
    ];
    export const list = [
        {
            scheme: "file",
            language: "64tasslist"
        }
    ];
    export const all = [...source, ...list];
}

export const configFilename = "64tasslang.json";