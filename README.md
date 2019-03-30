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

const login = createAction(
  'LOGIN/TRIGGER',
  'LOGIN/SUCCESS',
  'LOGIN/FAILURE'
)<
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

```typescript

```