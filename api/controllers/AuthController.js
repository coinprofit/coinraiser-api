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

module.exports = {

  // login: function(req, res) {
  //   res.view();
  // },

  authenticate: function(req, res) {
    res.view();
  },

  process: function(req, res) {
    AuthService.authenticateLocal(req, res);
  },

  // processLocal: function(req, res) {
  //   AuthService.authenticateLocal(req, res);
  // },

  // processToken: function(req, res) {
  //   AuthService.authenticateToken(req, res);
  // },

  logout: function(req, res) {
    AuthService.deauthenticate(req, res);
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {}

};
