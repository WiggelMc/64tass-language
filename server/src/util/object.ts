export function objectKeys<E extends object>(e: E): (keyof E & string)[] {
    return Object.keys(e) as (keyof E & string)[];
}

export function objectValues<E extends object>(e: E): E[keyof E][] {
    return objectKeys(e).map(k => e[k]);
}

export function ownObjectProperties<E extends object>(e: E): (keyof E & string)[] {
    return Object.getOwnPropertyNames(e) as (keyof E & string)[];
}

export function objectProperties<E extends object>(e: E): (keyof E & string)[] {
    const objectPrototype: string[] = ownObjectProperties(Object.prototype);
    const properties: (keyof E & string)[] = [];
    let current = e;
    
    while (current !== null) {
        const ownProperties = ownObjectProperties(current).filter(p => !objectPrototype.includes(p));
        properties.push(...ownProperties);
        current = Object.getPrototypeOf(current);
    }

    return [...new Set(properties)];
}