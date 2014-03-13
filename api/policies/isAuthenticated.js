/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller

  // Original test for user authentication:
  // if (req.session.authenticated) {

  // Try this test if need to get it working with websocket requests:
  //   req.session.passport.user

  // Test for user authentication with passport middleware installed
  // Might only work for HTTP requests, not websocket requests
  if (req.isAuthenticated()) {
    return next();
  }

  // User is not allowed
  return res.forbidden('error.noPermission');
};
