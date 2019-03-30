[![Build Status](https://travis-ci.org/thu-san/redux-actions-promise-wrapper.svg?branch=master)](https://travis-ci.org/thu-san/redux-actions-promise-wrapper)
[![Coverage Status](https://coveralls.io/repos/github/thu-san/redux-actions-promise-wrapper/badge.svg?branch=master)](https://coveralls.io/github/thu-san/redux-actions-promise-wrapper?branch=master)

# redux-actions-promise-wrapper

Type safe redux action creator (works with redux saga)

## Installation

```sh
npm install redux-actions-promise-wrapper --save
yarn add redux-actions-promise-wrapper
bower install redux-actions-promise-wrapper --save
```

## Feature

Create type safe action creators and enable callback for redux saga.

## Usage

### TypeScript

##### Create Action

```typescript
import { createAction } from 'redux-actions-promise-wrapper';

const login = createAction('LOGIN/TRIGGER', 'LOGIN/SUCCESS', 'LOGIN/FAILURE')<
  {
    email: string;
    password: string;
  },
  {
    session: string;
  }
>();
```

`login` now contains the following properties

```typescript
login.TRIGGER = 'LOGIN/TRIGGER';
login.SUCCESS = 'LOGIN/SUCCESS';
login.FAILURE = 'LOGIN/FAILURE';

login.trigger(payload) === { type: 'LOGIN/TRIGGER', payload }; // payload must have type { email: string, password: string }
login.success(payload) === { type: 'LOGIN/SUCCESS', payload }; // payload must have type { session: string }
login.failure() ===  { type: 'LOGIN/FAILURE' };

login(payload) === login.trigger(payload);
You can also call on login for trigger action.
```

#### Redux Saga Example

##### Types, Saga and Reducer

```typescript
// TYPES
interface ILoginTriggerPayload {
  account: string;
}

export const loginAction = createAction('LOGIN/TRIGGER', 'LOGIN/SUCCESS')(
  handleLogin,
  function*(arg: { session: string; account: string }) {
    return undefined;
  }
);
export const logoutAction = createAction('LOGOUT/TRIGGER')<{
  session: string;
}>();

// SAGA
function* handleLogin({ account }: ILoginTriggerPayload) {
  yield delay(1000);
  const putLoginSuccess = put(
    loginAction.success({ session: new Date().toString(), account })
  );
  yield putLoginSuccess;
  return reg(account);
}

export function* authSaga() {
  yield all([takeLatest(loginAction.TRIGGER, loginAction.handleTrigger)]);
}

// REDUCER
interface IAuth {
  account?: string;
  session?: string;
}

const INITIAL_STATE: IAuth = {};

type Actions = ExtractActions<{
  loginAction: typeof loginAction;
  logoutAction: typeof logoutAction;
}>;

const reducer: Reducer<IAuth, Actions> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case loginAction.SUCCESS: {
      const { account, session } = action.payload;
      return { ...state, account, session };
    }
    case logoutAction.TRIGGER: {
      const { session } = action.payload;
      console.log(`LOGOUT Reducer Session -  ${session}`);
      return {};
    }
    default:
      return state;
  }
};

export default reducer;
```

##### Combine Reducer

```typescript
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import auth, { authSaga } from './auth';

const reducers = combineReducers({
  auth
});

export type AppState = ReturnType<typeof reducers>;

// saga
export const rootSaga = function*() {
  yield all([authSaga()]);
};

export default reducers;
```

##### Container

```typescript
interface IState {
  account: string;
  loading: boolean;
}
type IProp = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
export class Dash extends PureComponent<IProp, IState> {
  state: IState = {
    account: '',
    loading: false
  };

  handleLogin = async () => {
    const { loginAction } = this.props;
    const { account } = this.state;
    this.setState({ loading: true });
    const { promise } = loginAction({ account });
    const result = await promise;
    alert(`You are now logged in as ${result}`);
    this.setState({ loading: false });
  };

  handleLogout = async () => {
    const { session, logoutAction } = this.props;
    if (session) {
      logoutAction({ session });
    }
  };

  render() {
    const { session, account: authAccount } = this.props;
    const { account, loading } = this.state;

    const loggedIn = !!session;

    return (
      <div
        style={{
          display: 'flex',
          height: 500,
          background: 'cyan',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div>
          <p>Status: {loggedIn ? 'Logged In' : 'Logged Out'}</p>
          <p>Session: {session}</p>
          <p>Email: {authAccount}</p>
          {loading ? (
            '...loading'
          ) : loggedIn ? (
            <button onClick={this.handleLogout}>Logout</button>
          ) : (
            <>
              <p>
                <input
                  type="text"
                  placeholder="account"
                  value={account}
                  onChange={({ target: { value } }) =>
                    this.setState({ account: value })
                  }
                />
              </p>
              <button onClick={this.handleLogin}>Login</button>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth: { account, session } }: AppState) => ({
  account,
  session
});

const mapDispatchToProps = {
  loginAction,
  logoutAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dash);
```
