import { call, put as sagaPut } from 'redux-saga/effects';

import { Action, GReturnable, IIReturn, rpResolve } from './types';

/**
 * Automatically resolves promise of Action.promise
 * @param innerSaga - Generator Function for redux-saga
 */
const promiseHandler = <T extends string, P, R>(
  innerSaga: (args?: P) => IterableIterator<R>
) =>
  function* innerFunction(action: Action<T, P, IIReturn<R>>) {
    try {
      const data: IIReturn<R> = yield call(innerSaga, action.payload);
      if (action.resolve) {
        action.resolve(data);
      }
    } catch (e) {
      if (action.reject) {
        action.reject(e);
      }
    }
  };

/**
 * Action Creator
 * @param type Action Type
 */
const actionCreator = <T, P, R>(type: T) => (payload?: P) => {
  let resolve: (value: IIReturn<R>) => void = () => {};
  let reject: (reason?: any) => void = () => {};
  const promise = new Promise<IIReturn<R>>((pResolve, pReject) => {
    resolve = pResolve;
    reject = pReject;
  });
  return {
    type,
    payload,
    promise,
    resolve,
    reject
  };
};

export { rpResolve };

/**
 * Extract Actions to be used in reducer
 * @example
 * type Actions = ExtractActions<loginAction | logoutAction>
 */
export type ExtractActions<A> = {
  [Key in keyof A]: A[Key] extends (...args: any[]) => any
    ? ReturnType<A[Key]>
    : never
}[keyof A];

/**
 * Generator return value
 * @param t any
 */
export function reg<T>(t: T) {
  return t as GReturnable<T>;
}

// Helper types
type invokeSignature<T extends string, P, R> = P extends undefined
  ? {
      (): Action<T, P, IIReturn<R>>;
    }
  : {
      (payload: P): Action<T, P, IIReturn<R>>;
    };
type handleAction<P, R, H> =
  | (P extends undefined
      ? () => IterableIterator<R>
      : (args: P) => IterableIterator<R>)
  | H;
type actionCreator<T extends string, P, R> = P extends undefined
  ? () => Action<T, P, IIReturn<R>>
  : (payload: P) => Action<T, P, IIReturn<R>>;
type actionHandler<T extends string, P, H, R> = H extends undefined
  ? undefined
  : (action: Action<T, P, IIReturn<R>>) => IterableIterator<any>;

export function createAction<T extends string>(
  type: T
): {
  (): {
    (): Action<T>;
    TRIGGER: T;
    trigger: () => Action<T>;
  };
  <P = undefined, H = undefined, R = undefined>(
    handleAction?: handleAction<P, R, H>
  ): {
    TRIGGER: T;
    trigger: actionCreator<T, P, R>;
    handleTrigger: actionHandler<T, P, H, R>;
  } & invokeSignature<T, P, R>;
};
export function createAction<T extends string, ST extends string>(
  type: T,
  successType: ST
): {
  (): {
    (): Action<T>;
    TRIGGER: T;
    trigger: () => Action<T>;
    SUCCESS: ST;
    success: () => Action<ST>;
  };
  <
    P = undefined,
    SP = undefined,
    H = undefined,
    R = undefined,
    SH = undefined,
    SR = undefined
  >(
    handleAction?: handleAction<P, R, H>,
    handleSuccess?: handleAction<SP, SR, SH>
  ): {
    TRIGGER: T;
    trigger: actionCreator<T, P, R>;
    handleTrigger: actionHandler<T, P, H, R>;
    SUCCESS: ST;
    success: actionCreator<ST, SP, SR>;
    handleSuccess: actionHandler<ST, SP, SH, SR>;
  } & invokeSignature<T, P, R>;
};
export function createAction<
  T extends string,
  ST extends string,
  FT extends string
>(
  type: T,
  successType: ST,
  failureType: FT
): {
  (): {
    (): Action<T>;
    TRIGGER: T;
    trigger: () => Action<T>;
    SUCCESS: ST;
    success: () => Action<ST>;
    FAILURE: FT;
    failure: () => Action<FT>;
  };
  <
    P = undefined,
    SP = undefined,
    FP = undefined,
    H = undefined,
    R = undefined,
    SH = undefined,
    SR = undefined,
    FH = undefined,
    FR = undefined
  >(
    handleAction?: handleAction<P, R, H>,
    handleSuccess?: handleAction<SP, SR, SH>,
    handleFailure?: handleAction<FP, FR, FH>
  ): {
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
export function createAction<
  T extends string,
  ST extends string,
  FT extends string
>(type: T, successType?: ST, failureType?: FT) {
  function actionPayload<P, R, SP, SR, FP, FR>(
    handleTrigger?: (args?: P) => IterableIterator<R>,
    handleSuccess?: (args?: SP) => IterableIterator<SR>,
    handleFailure?: (args?: FP) => IterableIterator<FR>
  ) {
    // handler return
    const routine = (payload?: P) => {
      let resolve: (value: IIReturn<R>) => void = () => {};
      let reject: (reason?: any) => void = () => {};
      const promise = new Promise<IIReturn<R>>((pResolve, pReject) => {
        resolve = pResolve;
        reject = pReject;
      });
      return {
        type,
        payload,
        promise,
        resolve,
        reject
      };
    };
    routine.TRIGGER = type;
    routine.trigger = actionCreator<T, P, R>(type);
    if (handleTrigger) {
      routine.handleTrigger = promiseHandler<T, P, R>(handleTrigger);
    }

    if (successType) {
      routine.SUCCESS = successType;
      routine.success = actionCreator<ST, SP, SR>(successType);
      if (handleSuccess) {
        routine.handleSuccess = promiseHandler<ST, SP, SR>(handleSuccess);
      }
    }

    if (failureType) {
      routine.FAILURE = failureType;
      routine.failure = actionCreator<FT, FP, FR>(failureType);
      if (handleFailure) {
        routine.handleFailure = promiseHandler<FT, FP, FR>(handleFailure);
      }
    }

    return routine;
  }
  return actionPayload;
}

/**
 * transform return type of redux-saga's put to any
 * @param action Action
 */
export const put = (action: Action) => sagaPut(action) as any;
