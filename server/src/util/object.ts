export function objectKeys<E extends object>(e: E): (keyof E & string)[] {
    return Object.keys(e) as (keyof E & string)[];
}

export function objectProperties<E extends object>(e: E): ((keyof E | 'constructor') & string)[] {
    return Object.getOwnPropertyNames(e.constructor.prototype) as ((keyof E | 'constructor') & string)[];
}

export function objectKeysAndProperties<E extends object>(e: E): ((keyof E | 'constructor') & string)[] {
    return objectProperties(e).concat(objectKeys(e));
}

export function objectValues<E extends object>(e: E): E[keyof E][] {
    return objectKeys(e).map(k => e[k]);
}