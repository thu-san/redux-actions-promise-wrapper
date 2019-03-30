import { Action, GReturnable, IIReturn, rpResolve } from './types';
/**
 * Action Creator
 * @param type Action Type
 */
declare const actionCreator: <T, P, R>(type: T) => (payload?: P | undefined) => {
    type: T;
    payload: P | undefined;
    promise: Promise<IIReturn<R>>;
    resolve: (value: IIReturn<R>) => void;
    reject: (reason?: any) => void;
};
export { rpResolve };
/**
 * Extract Actions to be used in reducer
 * @example
 * type Actions = ExtractActions<loginAction | logoutAction>
 */
export declare type ExtractActions<A> = {
    [Key in keyof A]: A[Key] extends (...args: any[]) => any ? ReturnType<A[Key]> : never;
}[keyof A];
/**
 * Generator return value
 * @param t any
 */
export declare function reg<T>(t: T): GReturnable<T>;
declare type invokeSignature<T extends string, P, R> = P extends undefined ? {
    (): Action<T, P, IIReturn<R>>;
} : {
    (payload: P): Action<T, P, IIReturn<R>>;
};
declare type handleAction<P, R, H> = (P extends undefined ? () => IterableIterator<R> : (args: P) => IterableIterator<R>) | H;
declare type actionCreator<T extends string, P, R> = P extends undefined ? () => Action<T, P, IIReturn<R>> : (payload: P) => Action<T, P, IIReturn<R>>;
declare type actionHandler<T extends string, P, H, R> = H extends undefined ? undefined : (action: Action<T, P, IIReturn<R>>) => IterableIterator<any>;
export declare function createAction<T extends string>(type: T): {
    (): {
        (): Action<T>;
        TRIGGER: T;
        trigger: () => Action<T>;
    };
    <P = undefined, H = undefined, R = undefined>(handleAction?: handleAction<P, R, H>): {
        TRIGGER: T;
        trigger: actionCreator<T, P, R>;
        handleTrigger: actionHandler<T, P, H, R>;
    } & invokeSignature<T, P, R>;
};
export declare function createAction<T extends string, ST extends string>(type: T, successType: ST): {
    (): {
        (): Action<T>;
        TRIGGER: T;
        trigger: () => Action<T>;
        SUCCESS: ST;
        success: () => Action<ST>;
    };
    <P = undefined, SP = undefined, H = undefined, R = undefined, SH = undefined, SR = undefined>(handleAction?: handleAction<P, R, H>, handleSuccess?: handleAction<SP, SR, SH>): {
        TRIGGER: T;
        trigger: actionCreator<T, P, R>;
        handleTrigger: actionHandler<T, P, H, R>;
        SUCCESS: ST;
        success: actionCreator<ST, SP, SR>;
        handleSuccess: actionHandler<ST, SP, SH, SR>;
    } & invokeSignature<T, P, R>;
};
export declare function createAction<T extends string, ST extends string, FT extends string>(type: T, successType: ST, failureType: FT): {
    (): {
        (): Action<T>;
        TRIGGER: T;
        trigger: () => Action<T>;
        SUCCESS: ST;
        success: () => Action<ST>;
        FAILURE: FT;
        failure: () => Action<FT>;
    };
    <P = undefined, SP = undefined, FP = undefined, H = undefined, R = undefined, SH = undefined, SR = undefined, FH = undefined, FR = undefined>(handleAction?: handleAction<P, R, H>, handleSuccess?: handleAction<SP, SR, SH>, handleFailure?: handleAction<FP, FR, FH>): {
        TRIGGER: T;
        trigger: actionCreator<T, P, R>;
        handleTrigger: actionHandler<T, P, H, R>;
        SUCCESS: ST;
        success: actionCreator<ST, SP, SR>;
        handleSuccess: actionHandler<ST, SP, SH, SR>;
        FAILURE: FT;
        failure: actionCreator<FT, FP, FR>;
        handleFailure: actionHandler<FT, FP, FH, FR>;
    } & invokeSignature<T, P, R>;
};
/**
 * transform return type of redux-saga's put to any
 * @param action Action
 */
export declare const put: (action: Readonly<{
    type: string;
    payload: undefined;
    promise: Promise<undefined>;
    resolve: (value: undefined) => void;
    reject: (reason?: any) => void;
}>) => any;
