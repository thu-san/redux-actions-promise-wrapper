import { createAction, ExtractActions, put, reg, rpResolve } from './index';

it('reg returns same object', () => {
  expect(reg(1)).toEqual(1);
  expect(reg('string')).toEqual('string');
  expect(reg(true)).toEqual(true);
  expect(reg({ name: 'John' })).toEqual({ name: 'John' });
  expect(reg(['cat', 'dog'])).toEqual(['cat', 'dog']);
});

it('returns promise resolve type', () => {
  const promise = () =>
    new Promise<'PROMISE RESOLVE'>(resolve => {
      resolve('PROMISE RESOLVE');
    });

  type returned = rpResolve<typeof promise>;
  const returned: returned = 'PROMISE RESOLVE';
  expect(returned).toEqual('PROMISE RESOLVE');
});

const testAction = async <A extends any, T extends string, P = undefined>(
  action: A,
  type: T,
  payload?: P,
  handlerReturn?: any,
  handleAction?: any,
  throwHandler?: boolean
) => {
  expect(action.type).toEqual(type);
  expect(action.payload).toEqual(payload);

  // check promise
  expect(typeof action.promise.then).toEqual('function');
  expect(typeof action.resolve).toEqual('function');
  expect(typeof action.resolve).toEqual('function');

  if (handleAction) {
    const gen = handleAction(action);
    gen.next();
    if (throwHandler) {
      gen.throw(handlerReturn);
    } else {
      gen.next(handlerReturn);
    }
    try {
      const result = await action.promise;
      expect(result).toEqual(handlerReturn);
    } catch (error) {
      expect(error).toEqual(handlerReturn);
    }
  }
};

const testTriggerAction = async (
  actionCreator: any,
  type: any,
  payload?: any,
  handlerReturn?: any
) => {
  expect(actionCreator.TRIGGER).toEqual(type);
  await testAction(
    actionCreator(payload),
    type,
    payload,
    handlerReturn,
    actionCreator.handleTrigger
  );
  await testAction(
    actionCreator(payload),
    type,
    payload,
    handlerReturn,
    actionCreator.handleTrigger,
    true
  );
};
const testSuccessAction = async (
  actionCreator: any,
  type: any,
  payload?: any,
  handlerReturn?: any
) => {
  expect(actionCreator.SUCCESS).toEqual(type);
  await testAction(
    actionCreator.success(payload),
    type,
    payload,
    handlerReturn,
    actionCreator.handleSuccess
  );
  await testAction(
    actionCreator.success(payload),
    type,
    payload,
    handlerReturn,
    actionCreator.handleSuccess,
    true
  );
};
const testFailureAction = async (
  actionCreator: any,
  type: any,
  payload?: any,
  handlerReturn?: any
) => {
  expect(actionCreator.FAILURE).toEqual(type);
  await testAction(
    actionCreator.failure(payload),
    type,
    payload,
    handlerReturn,
    actionCreator.handleFailure
  );
  await testAction(
    actionCreator.failure(payload),
    type,
    payload,
    handlerReturn,
    actionCreator.handleFailure,
    true
  );
};

describe('ACTIONS', () => {
  const triggerType = 'TRIGGER';
  const successType = 'SUCCESS';
  const failureType = 'FAILURE';

  it('create action', async () => {
    const t = createAction(triggerType)();
    const s = createAction(triggerType, successType)();
    const f = createAction(triggerType, successType, failureType)();

    await testTriggerAction(t, triggerType, undefined, undefined);

    await testTriggerAction(s, triggerType, undefined, undefined);
    await testSuccessAction(s, successType, undefined, undefined);

    await testTriggerAction(f, triggerType, undefined, undefined);
    await testSuccessAction(f, successType, undefined, undefined);
    await testFailureAction(f, failureType, undefined, undefined);
  });

  it('create action with handler', async () => {
    const actionReturn = 'ACTION RETURN';
    const handleAction = function*() {
      yield 'a';
      return reg(actionReturn);
    };
    const t = createAction(triggerType)(handleAction);
    const s = createAction(triggerType, successType)(
      handleAction,
      handleAction
    );
    const f = createAction(triggerType, successType, failureType)(
      handleAction,
      handleAction
    );

    await testTriggerAction(t, triggerType, undefined, actionReturn);

    await testTriggerAction(s, triggerType, undefined, actionReturn);
    await testSuccessAction(s, successType, undefined, actionReturn);

    await testTriggerAction(f, triggerType, undefined, actionReturn);
    await testSuccessAction(f, successType, undefined, actionReturn);
    await testFailureAction(f, failureType, undefined, actionReturn);
  });

  it('create trigger action with handler and payload', async () => {
    const actionReturn = 'ACTION RETURN';
    const handleAction = function*({ name }: { name: string }) {
      yield name;
      yield 'a';
      return reg(actionReturn);
    };
    const t = createAction(triggerType)(handleAction);
    const s = createAction(triggerType, successType)(
      handleAction,
      handleAction
    );
    const f = createAction(triggerType, successType, failureType)(
      handleAction,
      handleAction,
      handleAction
    );

    await testTriggerAction(t, triggerType, { name: 'John' }, actionReturn);

    await testTriggerAction(s, triggerType, { name: 'John' }, actionReturn);
    await testSuccessAction(s, successType, { name: 'John' }, actionReturn);

    await testTriggerAction(f, triggerType, { name: 'John' }, actionReturn);
    await testSuccessAction(f, successType, { name: 'John' }, actionReturn);
    await testFailureAction(f, failureType, { name: 'John' }, actionReturn);
  });
});

it('filter reducer actions', () => {
  function* handleLoginTrigger({
    email,
    password
  }: {
    email: string;
    password: string;
  }) {
    yield new Promise(resolve => resolve());
  }
  const loginAction = createAction(
    'LOGIN/TRIGGER',
    'LOGIN/SUCCESS',
    'LOGIN/FAILURE'
  )(handleLoginTrigger, function*({ session }: { session: string }) {
    return undefined;
  });
  const logoutAction = createAction(
    'LOGOUT/TRIGGER',
    'LOGOUT/SUCCESS',
    'LOGOUT/FAILURE'
  )();

  type actionType = ExtractActions<{
    a: typeof loginAction;
    b: typeof logoutAction;
  }>;

  const reducer = (state: any, action: actionType) => {
    switch (action.type) {
      case loginAction.TRIGGER:
        const { email, password } = action.payload;
        return { ...state, email, password };
      case loginAction.SUCCESS:
        const { session } = action.payload;
        return { ...state, session };
      default:
        return state;
    }
  };
});

it('put return any type', () => {
  const triggerType = 'LOGIN/TRIGGER';
  const loginAction = createAction(triggerType)();
  const putLogin: any = put(loginAction());
  expect(putLogin.payload.action.type).toEqual(triggerType);
});
