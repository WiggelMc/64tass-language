import * as fs from "fs";
import path = require("path");
import { Range, TextDocumentContentChangeEvent } from "vscode-languageserver";

class Index {

    static updateFile(path: fs.PathLike) {
        
    }

    static updateFileWithChanges(path: fs.PathLike, changes: TextDocumentContentChangeEvent[]) {
                
    }

    static updateAllFiles() {
        
    }


    static getSemanticTokensFull(path: fs.PathLike) {

    }

    static getSemanticTokensRange(path: fs.PathLike, range: Range) {
        
    }

    static getSemanticTokensDelta(path: fs.PathLike, lastVersion: number) {
        
    }

    
}