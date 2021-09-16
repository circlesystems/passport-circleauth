/**
 * Module dependencies.
 */
 var unicauthwrapper = require('@habloapp/unicauth-wrapper')
 var passport = require('passport-strategy')
 
 var util = require('util')
 var lookup = require('./utils').lookup
 
 /**
 * Unic Auth `Strategy` constructor.
 *
 * Options:
 *   - `appKey`  Application appKey.
 *   - `readKey`  Application readKey.
 *   - `writeKey`  Application writeKey.
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new UnicAuthStrategy(
 *       {
 *         appKey: APPLICATION_APPKEY,
 *         readKey: APPLICATION_READKEY,
 *         writeKey: APPLICATION_WRITEKEY,
 *         passReqToCallback: true,
 *       },
 *       function(req, profile, done) {
 *         User.findOne({ id: profile.id }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
 function Strategy(options, verify) {
   if (typeof options === 'function') {
     verify = options
     options = {}
   }
 
   if (!verify) { throw new TypeError('UnicAuthStrategy requires a verify callback') }
   if (!options.appKey) { throw new TypeError('appKey option is required') }
   if (!options.readKey) { throw new TypeError('readKey option is required') }
   if (!options.writeKey) { throw new TypeError('writeKey option is required') }
 
   unicauthwrapper.configure(options)
 
   this._appKey = options.appKey
   this._readKey = options.readKey
   this._writeKey = options.writeKey
 
   passport.Strategy.call(this)
   this.name = 'unicauth'
   this._verify = verify
   this._passReqToCallback = options.passReqToCallback
 }
 
 /**
 * Inherit from `passport.Strategy`.
 */
 util.inherits(Strategy, passport.Strategy)
 
 /**
 * Authenticate request based on the contents of a authenticated callback.
 *
 * @param {Object} req
 * @api protected
 */
 Strategy.prototype.authenticate = async function(req, options) {
   options = options || {}
 
   var userID = lookup(req.body, 'userID') || lookup(req.query, 'userID')
   var sessionID = lookup(req.body, 'sessionID') || lookup(req.query, 'sessionID')
   var authID = lookup(req.body, 'authID') || lookup(req.query, 'authID')
   var authType = lookup(req.body, 'type') || lookup(req.query, 'type')
   var signature = lookup(req.body, 'signature') || lookup(req.query, 'signature')
   var customID = lookup(req.body, 'customID') || lookup(req.query, 'customID')
   var self = this
 
   let isTwoFactorValid = authType === 'twoFactor' && customID
   let isLoginValid = authType === 'login'
   if (!userID || !sessionID || !authID || !authType || !signature || (!isTwoFactorValid && !isLoginValid)) {
     return self.redirect(`https://unicauth.com/login/${self._appKey}`)
   }
 
   function verifiedCallback(err, user, info) {
     if (err) {
       return self.error(err)
     }
     if (!user) {
       if (authType === 'login') {
         return self.redirect(`https://console.unicauth.com/dashboard/login_email/index?appKey=${self._appKey}`)
       } else {
         return self.fail(info)
       }
     }
     self.success(user, info)
   }
 
   try {
     const userSession = await unicauthwrapper.getUserSession(sessionID, userID)
     if (!userSession || !userSession.data || (userSession.data.status !== 'active' && userSession.data.status !== 'usedOnce')) {
       throw Error('Invalid Unic Auth session.')
     }
 
     let email = null
     if (customID) {
       email = Buffer.from(customID.replace(' ', /\+/g), 'base64').toString('utf-8')
     }
 
     const profile = {
       provider: 'unicauth',
       id: userSession.data.userID,
       email: email,
       displayName: email,
       userID: userSession.data.userID,
       sessionID: userSession.data.sessionID,
       authID: authID
     }
     if (self._passReqToCallback) {
       await self._verify(req, profile, verifiedCallback)
     } else {
       await self._verify(profile, verifiedCallback)
     }
   } catch (ex) {
     return self.error(ex)
   }
 }
 
 /**
 * Expose `Strategy`.
 */
 module.exports = Strategy
 