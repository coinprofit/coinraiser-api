/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {

  // Need to switch to using tokens instead of cookie-based sessions
  // - easier for mobile apps to handle, less need for webviews
  // https://gist.github.com/robwormald/9441746

  login: function(req, res) {
    res.view();
  },

  // Check out this bearer token answer:
  // http://stackoverflow.com/questions/21447155/imaplementing-passport-http-bearer-token-with-sails-js

  // From: https://gist.github.com/robwormald/9441746
  // authenticate : function(req,res){

  //   var username = req.param('username');
  //   var password = req.param('password');

  //   if(!username || !password) {
  //     return res.json(403, {
  //       err: 'username and password required'}
  //     );
  //   }

  //   User.findOneByUsername(username, function(err,user) {
  //     if(!user) {
  //       return res.json(403, {
  //         err: 'invalid username or password'
  //       });
  //     }

  //     User.validPassword(password, user, function(err,valid) {
  //       if(err){
  //         return res.json(403,{
  //           err: 'forbidden'
  //         });
  //       }
  //       if(!valid) {
  //         return res.json(403,{
  //           err: 'invalid username or password'
  //         });
  //       }
  //       else{
  //         //TODO grab auth permission stuff to encode into token.
  //         res.json({
  //           user: user,
  //           token: sailsTokenAuth.issueToken(user)
  //         });
  //       }
  //     });
  //   });
  // },

  // passport_local: function(req, res) {
  process: function(req, res) {
    console.log('Passport Local');

    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        console.log('Passport Local err', err, user);
        return res.forbidden('error.noPermission');
      }

      req.logIn(user, function(err) {
        console.log('Passport Local logIn', err);
        if (err) {
          return res.forbidden('error.noPermission');
        }
        return res.send({
          message: 'login successful'
        });
      });
    })(req, res);
  },

  logout: function(req, res) {
    req.logout();
    res.send({
      message:'logout successful'
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {}

};
