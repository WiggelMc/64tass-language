interface TassSymbol {

}

class Constant implements TassSymbol {}
class Label implements TassSymbol {}
class Macro implements TassSymbol {}
class Variable implements TassSymbol {}

interface Position {

}

interface Scope {
    getSymbol(name: string, position: Position): TassSymbol | undefined
    getSymbolFromChildren(name: string, position: Position): TassSymbol | undefined
    isBlock(): boolean
}

abstract class BlockScope implements Scope {
    scopes: Scope[] = [];
    symbols: Map<string,TassSymbol> = new Map();

    getSymbolFromChildren(name: string, position: Position): TassSymbol | undefined {
        let symbol = this.symbols.get(name);

        for (const child of this.scopes) {
            if (symbol !== undefined) {
                break;
            }

            if (!child.isBlock()) {
                symbol = child.getSymbolFromChildren(name, position);
            }
        }
        return symbol;
    }

    getSymbol(name: string, position: Position): TassSymbol | undefined {
        throw new Error("Not Implemented");
    }

    isBlock(): boolean {
        return true;
    }
}

abstract class NonBlockScope implements Scope {
    getSymbol(name: string, position: Position): TassSymbol {

        throw new Error("Not Implemented");
    }

    isBlock(): boolean {
        return false;
    }
}