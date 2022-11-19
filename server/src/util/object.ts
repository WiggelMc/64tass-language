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
    const objectPrototype = ownObjectProperties(Object.prototype);
    const methods: (keyof E & string)[] = [];
    let obj = e;
    
    while (obj !== null) {
        const properties = ownObjectProperties(obj).filter(p => !(p in objectPrototype));
        methods.push(...properties);
        obj = Object.getPrototypeOf(obj);
    }

    return [...new Set(methods)];
}