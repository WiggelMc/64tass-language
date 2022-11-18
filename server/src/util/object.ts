export function objectKeys<E extends object>(e: E): (keyof E & string)[] {
    return Object.keys(e) as (keyof E & string)[];
}

export function objectValues<E extends object>(e: E): E[keyof E][] {
    return objectKeys(e).map(k => e[k]);
}