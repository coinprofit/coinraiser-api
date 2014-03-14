/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/blueprints.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  me: function(req, res) {
    if (!req.user) {
      return res.forbidden('error.noPermission');
    }
    var user = _.clone(req.user.toObject());
    user.avatar = req.user.gravatarImage();

    user = _.omit(user,
      'password',
      'salt',
      'locked',
      'passwordFailures',
      'lastPasswordFailure',
      'resetToken'
    );
    res.json(user);
  },

  // Check if username is available
  check: function(req, res) {
    UserService.checkUsername(req, res);
  },

  activate: function(req, res) {
    // TODO: Implement account activation
  },

  resetPassword: function(req, res) {
    // TODO: Implement passsword reset
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}


};
