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
    // if (!req.user) {
    //   return res.forbidden('error.noPermission');
    // }
    var user = req.user;

    var obj = {
      user: _.extend(_.omit(user.toObject(),
        'password',
        'salt',
        'locked',
        'passwordFailures',
        'lastPasswordFailure',
        'resetToken'
      ), {
        avatar: user.gravatarImage()
      }),
      coinbase: {}
    };

    if (user.isLinked()) {
      return CoinbaseService.getAccount(user, function(err, account) {
        if (err) {
          res.badRequest({
            message: err
          });
        }
        obj.coinbase = account;
        res.json(obj);
      });
    }

    res.json(obj);
  },

  transactions: function(req, res) {
    var user = req.user;
    if (user.isLinked()) {
      CoinbaseService.getTransactions(user, function(err, transactions) {
        if (err) {
          res.badRequest({
            message: err
          });
        }
        res.json({
          user: user.toJSON(),
          transactions: transactions
        });
      });
    }
  },

  // balance: function(req, res) {
  //   var user = req.user;
  //   if (user.isLinked()) {
  //     CoinbaseService.getBalance(user, function(err, balance) {
  //       if (err) {
  //         res.badRequest({
  //           message: err
  //         });
  //       }
  //       res.json({
  //         user: user.toJSON(),
  //         balance: balance
  //       });
  //     });
  //   }
  // },

  // account: function(req, res) {
  //   var user = req.user;
  //   CoinbaseService.getAccount(user, function(err, account) {
  //     if (err) {
  //       res.badRequest({
  //         message: err
  //       });
  //     }
  //     res.json({
  //       user: user.toJSON(),
  //       account: account
  //     });
  //   });
  // },

  // createAddress: function(req, res) {
  //   var user = req.user;
  //   CoinbaseService.createReceiveAddress(user, function(err, address) {
  //     if (err) {
  //       res.badRequest({
  //         message: err
  //       });
  //     }
  //     res.json({
  //       user: user.toJSON(),
  //       address: address
  //     });
  //   });
  // },

  // Check if username is available
  // check: function(req, res) {
  //   UserService.checkUsername(req, res);
  // },

  // activate: function(req, res) {
  //   // TODO: Implement account activation
  // },

  // resetPassword: function(req, res) {
  //   // TODO: Implement passsword reset
  // },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}


};
