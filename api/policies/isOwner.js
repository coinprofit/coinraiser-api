/**
 * isOwner
 *
 * @module      :: Policy
 * @description :: Simple policy to allow a user to access data they own
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  // Check if the current user is the requested user
  if (req.user === req.params.id) {
    // Add flag to request so that data lookup can return full user details instead of limited details
    req.isOwner = true;
  }
  return next();
};
