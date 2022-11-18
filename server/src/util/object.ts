export function objectKeys<E extends object>(e: E): (keyof E)[] {
    return Object.keys(e) as (keyof E)[];
}

export function objectValues<E extends object>(e: E): E[keyof E][] {
    return objectKeys(e).map(k => e[k]);
}