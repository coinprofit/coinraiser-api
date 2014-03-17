/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {

  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  //
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
  '/': {
    view: 'homepage'
  },
  '/tutorial': {
    view: 'tutorial'
  },
  // 'get /login': {
  //   controller: 'auth',
  //   action: 'login'
  // },
  // 'post /login': {
  //   controller: 'auth',
  //   action: 'processLocal'
  // },
  'get /authenticate': {
    controller: 'auth',
    // action: 'token'
    action: 'authenticate'
  },
  'post /authenticate': {
    controller: 'auth',
    action: 'process'
    // action: 'processToken'
  },
  '/logout': {
    controller: 'auth',
    action: 'logout'
  },
  'get /me': {
    controller: 'user',
    action: 'me'
  },
  'get /me/transactions': {
    controller: 'user',
    action: 'transactions'
  },
  // 'get /me/balance': {
  //   controller: 'user',
  //   action: 'balance'
  // },
  // 'get /me/account': {
  //   controller: 'user',
  //   action: 'account'
  // },
  // 'post /me/address': {
  //   controller: 'user',
  //   action: 'createAddress'
  // },

  // Add support for POST updates in addition to PUT updates
  'post /users/:id': {
    controller: 'user',
    action: 'update'
  },
  'post /campaigns/:id': {
    controller: 'campaign',
    action: 'update'
  },
  'post /campaigns/:id/claim': {
    controller: 'campaign',
    action: 'claim'
  },
  'post /donations/:id': {
    controller: 'donation',
    action: 'update'
  },
  'post /donations/:id/donate': {
    controller: 'donation',
    action: 'donate'
  }

  // 'post /campaigns': {
  //   controller: 'campaign',
  //   action: 'createWithAddress'
  // }

  // Custom routes here...


  // If a request to a URL doesn't match any of the custom routes above, it is matched
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.

};
