import { EventEmitter } from "events";
import { objectKeys } from "../object";

export type FileEmitter<F> = (file: F) => boolean;
export type FileListener<F> = (file: F) => void;

export class FileEventEmitter<C extends object> {
    eventEmitter: EventEmitter = new EventEmitter();

    emit<E extends keyof C>(event: E & string, file: C[E]): boolean {
        return this.eventEmitter.emit(event, file);
    }
    on<E extends keyof C>(event: E & string, listener: FileListener<C[E]>): this {
        this.eventEmitter.on(event, listener);
        return this;
    }
    off<E extends keyof C>(event: E & string, listener: FileListener<C[E]>): this {
        this.eventEmitter.off(event, listener);
        return this;
    }

    register<I extends FileEventListener<C>>(next: I): I {
        for (const key of objectKeys(next)) {
            if (typeof next[key] === 'function') {
                this.eventEmitter.on(key, next[key]);
            }
        }
        return next;
    }
}

export type FileEventListener<C> = {
    [K in keyof C]: FileListener<C[K]>;
};

//provides
//uniform IN/OUT with two sets of generic Params
//method to chain modules together

//base class for all index modules