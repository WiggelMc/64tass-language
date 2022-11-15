export function enumKeys<E extends Object>(e: E): (keyof E)[] {
    return Object.keys(e) as (keyof E)[];
}

export function enumValues<E extends Object>(e: E): E[keyof E][] {
    return enumKeys(e).map(k => e[k]);
}