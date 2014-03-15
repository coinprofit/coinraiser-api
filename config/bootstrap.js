/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

// module.exports.bootstrap = function (cb) {

//   // It's very important to trigger this callack method when you are finished
//   // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
//   cb();
// };

// Support passport auth when using websockets
// http://stackoverflow.com/a/18343226/220599
module.exports.bootstrap = function (cb) {

  var passport = require('passport');
  var initialize = passport.initialize();
  var session = passport.session();
  var http = require('http');
  var methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];

  // sails.removeAllListeners('router:request');
  // sails.on('router:request', function(req, res) {
  //   initialize(req, res, function () {
  //     session(req, res, function (err) {
  //       if (err) {
  //         return sails.config[500](500, req, res);
  //       }
  //       for (var i = 0; i < methods.length; i++) {
  //         req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
  //       }
  //       sails.router.route(req, res);
  //     });
  //   });
  // });

  // Initialize Coinbase CoinAPI Provider
  CoinbaseService.initialize();

  cb();
};

