/**
 * UserController
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

  login: function (req,res) {
    res.view();
  },

  passport_local: function(req, res) {
    console.log('Passport Local');

    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        console.log('Passport Local err', err, user);
        res.forbidden('You are not permitted to perform this action.');
        // res.redirect('/user/login');
        return;
      }

      req.logIn(user, function(err) {
        console.log('Passport Local logIn', err);
        if (err) {
          res.forbidden('You are not permitted to perform this action.');
          // res.redirect('/user/login');
          return;
        }

        // res.redirect('/');
        return;
      });
    })(req, res);
  },

  logout: function (req,res)
  {
    req.logout();
    // res.redirect('/');
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}


};
