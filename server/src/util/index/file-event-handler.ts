import { EventEmitter } from "events";
import { objectKeys } from "../object";

export type Emitter<F> = (f: F) => boolean;
export type Listener<F> = (f: F) => void;

export class FileEventEmitter<E extends object> {
    eventEmitter: EventEmitter = new EventEmitter();

    emit<K extends keyof E>(event: K & string, file: E[K]): boolean {
        return this.eventEmitter.emit(event, file);
    }
    on<K extends keyof E>(event: K & string, listener: Listener<E[K]>): this {
        this.eventEmitter.on(event, listener);
        return this;
    }
    off<K extends keyof E>(event: K & string, listener: Listener<E[K]>): this {
        this.eventEmitter.off(event, listener);
        return this;
    }

    register<I extends FileEventListener<E>>(next: I): I {
        for (const key of objectKeys(next)) {
            if (typeof next[key] === 'function') {
                this.eventEmitter.on(key, next[key]);
            }
        }
        return next;
    }
}

export type FileEventListener<C> = {
    [K in keyof C]: Listener<C[K]>;
};

//provides
//uniform IN/OUT with two sets of generic Params
//method to chain modules together

//base class for all index modules