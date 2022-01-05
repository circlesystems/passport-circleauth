# Circle Auth Strategy for Passport

Circle Auth Strategy for [Passport](http://www.passportjs.org/) using [Circle Auth API](https://circleauth.gocircle.ai/docs/)
<br>

Circle Auth allows you to quickly implement userless/passwordless login and 2FA (no more paying for SMS to have 2FA)

## Installation

First make sure to get your credentials on [Circle Auth Console](https://console.gocircle.com/), if you want to test first, use [Circle Auth - Demo](https://circleauth.gocircle.ai/demo)

### For [Node.js](https://nodejs.org/)

#### npm

Install it via:

```shell
npm install @circlesystems/passport-circleauth --save
```

## Example

```javascript
const CircleAuthStrategy = require('@circlesystems/passport-circleauth').Strategy

const strategy = new CircleAuthStrategy({
    appKey: APPLICATION_APPKEY,
    readKey: APPLICATION_READKEY,
    writeKey: APPLICATION_WRITEKEY,
    passReqToCallback: true
  },
  function(req, profile, done) {
    // ...
  }
)
```

At [Passport docs](http://www.passportjs.org/docs/) you can find more examples on how Passport works with strategies.

## Distribuition

1.  Update package `version` at `package.json`.
2.  Open terminal and run `npm publish`.
3.  Visit https://www.npmjs.com/package/@circlesystems/passport-circleauth to check latest version.
