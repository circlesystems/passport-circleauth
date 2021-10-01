# Unic Auth Strategy for Passport

Unic Auth Strategy for [Passport](http://www.passportjs.org/) using [Unic Auth API](https://unicauth.com/alpha/docs/)
<br>

Unic Auth allows you to quickly implement userless/passwordless login and 2FA (no more paying for SMS to have 2FA)

## Installation

First make sure to get your credentials on [Unic Auth](https://console.unicauth.com/), if you want to test first, use [Unic Auth - Demo](https://unicauth.com/demo)

### For [Node.js](https://nodejs.org/)

#### npm

Install it via:

```shell
npm install @habloapp/passport-unicauth --save
```

## Example

```javascript
const UnicAuthStrategy = require('@habloapp/passport-unicauth').Strategy

const strategy = new UnicAuthStrategy({
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
3.  Visit https://www.npmjs.com/package/@habloapp/passport-unicauth to check latest version.