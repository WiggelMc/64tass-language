interface TassSymbol {
    isValid(position: Position): boolean
}

class Constant implements TassSymbol {
    isValid(position: Position): boolean {
        throw new Error("Method not implemented.");
    }
}
class Label implements TassSymbol {
    isValid(position: Position): boolean {
        throw new Error("Method not implemented.");
    }
}
class Macro implements TassSymbol {
    isValid(position: Position): boolean {
        throw new Error("Method not implemented.");
    }
}
class Variable implements TassSymbol {
    isValid(position: Position): boolean {
        throw new Error("Method not implemented.");
    }
}

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
        if (symbol?.isValid(position)) {
            return symbol;
        }

        for (const child of this.scopes) {
            if (!child.isBlock()) {
                const symbol = child.getSymbolFromChildren(name, position);
                if (symbol?.isValid(position)) {
                    return symbol;
                }
            }
        }
        return undefined;
    }

    getSymbol(name: string, position: Position): TassSymbol | undefined {
        throw new Error("Not Implemented");
    }

    isBlock(): boolean {
        return true;
    }
}

abstract class NonBlockScope implements Scope {
    getSymbolFromChildren(name: string, position: Position): TassSymbol | undefined {
        throw new Error("Method not implemented.");
    }
    getSymbol(name: string, position: Position): TassSymbol {

        throw new Error("Not Implemented");
    }

    isBlock(): boolean {
        return false;
    }
}