'use strict';

var passport = require('passport');
var jwt = require('jsonwebtoken');
var socketjwt = require('socketio-jwt');

// Token-based authentication:
//
//  http://blog.auth0.com/2014/01/07/angularjs-authentication-with-cookies-vs-token/
//  https://speakerdeck.com/woloski/death-to-cookies-long-live-tokens
//  http://www.youtube.com/watch?v=yo2sG5NMhhg
//  https://github.com/xtuple/oauth2orize-jwt-bearer
//
//  Token auth with Sails:
//
//  https://gist.github.com/robwormald/9441746
//  https://github.com/swelham/sails-jwt-example
//  https://gist.github.com/swelham/8691247
//  http://stackoverflow.com/questions/20228572/passport-local-with-node-jwt-simple/20274700#20274700
//  http://stackoverflow.com/questions/21447155/imaplementing-passport-http-bearer-token-with-sails-js
//
//  Token auth with Passport:
//
//  https://www.npmjs.org/package/passport-coinbase
//  https://github.com/roblevintennis/passport-api-tokens
//  https://github.com/jaredhanson/passport-http-bearer
//
//

var jwtSecret = process.env.TOKEN_SECRET || 'xStmbyc066BOFn40gIr29y09Ud94z1P7';

module.exports = {

  /**
   * Issue JSON Web Token
   *
   * @param  {Object} payload data to encode into the token
   * @return {String}         JWT token
   */
  issueToken: function(payload){
    var token = jwt.sign(payload,jwtSecret)
    return token;
  },

  /**
   * Verify JSON Web Token
   *
   * Verifies provided token is valid and passed decoded value to verified function.
   *
   * @param  {String} token       JWT Token to verify and decode
   * @param  {Function} verified  function to call with verified and decoded data
   * @return {[type]}             [description]
   */
  verifyToken: function(token,verified){
    return jwt.verify(token,jwtSecret,{},verified)
  },

  // authenticateToken: function(req, res) {
  //   console.log('Authenticating with passport token');
  //   passport.authenticate('bearer', {session: false}, function(err, user) {
  //     console.log('authToken',req.user, user);
  //     next();
  //     // res.json(req.user);
  //   })(req, res);
  // },

  authenticateLocal: function(req, res) {
    // console.log('Authenticating with passport local');
    passport.authenticate('local', {session: false}, function(err, user, info) {
      if ((err) || (!user)) {
        // console.log('Passport Local err', err, user);
        return res.forbidden('error.noPermission');
      }
      req.logIn(user, function(err) {
        // console.log('Passport Local logIn', err);
        if (err) {
          return res.forbidden('error.noPermission');
        }
        return res.json({
          user: user,
          token: AuthService.issueToken({
            id: user.id,
            username: user.username,
            email: user.email
          })
        });
      });
    })(req, res);
  },

  deauthenticate: function(req, res) {
    req.logout();
    res.send({
      message:'logout successful'
    });
  },


  // ---- Passport Configuration ---


  // TOOD: Move everything below to PassportService ???

  // This is called when a user logs in
  localStrategyHandler: function(username, password, done) {
    console.log('Passport local strategy handler', username);
    User
      .findOne({ username: username})
      .done(function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
          // return done(null, false, { message: 'Unknown user ' + username });
        }
        if(!user.validatePassword(password)) {
          return done(null, false, { message: 'Invalid credentials' });
          // return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
      });
  },

  // This is called with every request that includes an authorization token
  bearerStrategyHandler: function(token, done) {
    // console.log('bearer token',token);
    AuthService.verifyToken(token, function(err, payload) {
      // console.log('bearer payload',payload, err);
      if (err) {
        return done(err);
      }
      if (!payload || !payload.id) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      User
        .findOneById(payload.id)
        .done(function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }
          return done(null, user);
      });
    });
 },

  serializeUser: function(user, done) {
    done(null, user.id);
  },

  deserializeUser: function(id, done) {
    // console.log('Passport deserializeUser', id);
    User.findOneById(id).done(function (err, user) {
      done(err, user);
    });
  }

};


