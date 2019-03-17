/**
 * Omit field of mapped type by value
 */
export declare type OmitByValue<O extends object, V> = Pick<O, ({
    [P in keyof O]: O[P] extends V ? never : P;
})[keyof O]>;
/**
 * Action with promise
 */
export declare type Action<T extends string = string, P = undefined, R = undefined> = Readonly<{
    type: T;
    payload: P;
    promise: Promise<R>;
    resolve: (value: R) => void;
    reject: (reason?: any) => void;
}>;
/**
 * return type of generator function
 * @note
 * type Returnable<T> = { __returnedType?: T }; // * use this if dont need to check string and number literals
 */
export declare type GReturnable<T> = {
    __returnedType?: T;
} & T;
/**
 * Obtain return type of GeneratorFunction
 * @example
 * (...args: any[]) => IterableIterator<string | number | GReturnable<boolean>>
 * would have type boolean;
 */
export declare type GReturn<T> = T extends (...args: any) => IterableIterator<any> ? GeneratorReturnStrict<T> : undefined;
declare type GeneratorReturnStrict<T extends (...args: any) => IterableIterator<any>> = ReturnType<T> extends IterableIterator<infer I> ? NonNullable<Extract<I, GReturnable<unknown>>['__returnedType']> extends never ? undefined : NonNullable<Extract<I, GReturnable<unknown>>['__returnedType']> : never;
/**
 * Obtain return type of IterableIterator (returned from Generator Function)
 * @example
 * IterableIterator<string | number | GReturnable<boolean>> -> boolean
 * IterableIterator<string | number> -> undefined
 */
export declare type IIReturn<T> = IterableIteratorReturn<T> extends never ? undefined : IterableIteratorReturn<T>;
declare type IterableIteratorReturn<T> = NonNullable<Extract<T, GReturnable<unknown>>['__returnedType']>;
/**
 * Get resolve type of Promise
 */
export declare type PromiseResolve<T extends (...args: any[]) => any> = ReturnType<T> extends Promise<infer U> ? U : T;
export {};
