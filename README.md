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

## Usage

### TypeScript

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

`login` now contains the following properties

login.TRIGGER = 'LOGIN/TRIGGER';
login.SUCCESS = 'LOGIN/SUCCESS';
login.FAILURE = 'LOGIN/FAILURE';

login.trigger(payload) === { type: 'LOGIN/TRIGGER', payload }; // payload must have type { email: string, password: string }
login.success(payload) === { type: 'LOGIN/SUCCESS', payload }; // payload must have type { session: string }
login.failure() ===  { type: 'LOGIN/FAILURE' };
```

#### Calling on `login(payload)` is the same as `login.trigger(payload)`.

### Javascript

```javascript
var pluralise = require('mypluralize');
var boys = pluralise.getPlural('Boy');
```

<!-- ## Usage

### Javascript

```javascript
var pluralise = require('mypluralize');
var boys = pluralise.getPlural('Boy');
```

```sh
Output should be 'Boys'
```

### TypeScript

```typescript
import { getPlural } from 'mypluralize';
console.log(getPlural('Goose'));
```

```sh
Output should be 'Geese'
```

### AMD

```javascript
define(function(require, exports, module) {
  var pluralise = require('mypluralize');
});
```

## Test

```sh
npm run test
``` -->
