
'use strict';

var coinapi = require('coinapi');
var Provider = coinapi.Provider;
var coinbaseDef = coinapi.definitions.coinbase;
var request = require('request');

var CoinbaseProvider = Provider.createClass({
  definition: coinbaseDef,
  requestDefaults: {}
});

var inst;

module.exports = {
  initialize: function(credentials) {
    inst = new CoinbaseProvider(credentials || sails.config.coinbase.api);
  },

  getBalance: function(user, done) {
    if (!inst) {
      return done({
        message: 'Coinbase provider not initialized'
      });
    }

    function makeRequest(next) {
      var params = {};
      if (user.isLinked()) {
        params.access_token = user.coinbaseAccess;
      }
      inst.api.account.balance(next, params);
    }

    CoinbaseService.tokenRefresher(user, makeRequest, done);

  },

  getAccount: function(user, done) {
    if (!inst) {
      return done({
        message: 'Coinbase provider not initialized'
      });
    }

    function makeRequest(next) {
      var params = {};
      if (user.isLinked()) {
        params.access_token = user.coinbaseAccess;
      }
      inst.api.account.changes(next, params);
    }

    CoinbaseService.tokenRefresher(user, makeRequest, done);
  },

  getTransactions: function(user, done) {
    if (!inst) {
      return done({
        message: 'Coinbase provider not initialized'
      });
    }

    console.log('keys',_.keys(inst.api));

    function makeRequest(next) {
      var params = {};
      if (user.isLinked()) {
        params.access_token = user.coinbaseAccess;
      }
      inst.api.transactions(next, params);
    }

    CoinbaseService.tokenRefresher(user, makeRequest, done);
  },

  createReceiveAddress: function(user, props, done) {
    if (!inst) {
      return done({
        message: 'Coinbase provider not initialized'
      });
    }

    function makeRequest(next) {
      var params = props || {};
      if (user.isLinked()) {
        params.access_token = user.coinbaseAccess;
      }
      inst.api.account.receiveAddress.create(next, params);
    }

    CoinbaseService.tokenRefresher(user, makeRequest, done);
  },

  sendMoney: function(user, props, done) {
    if (!inst) {
      return done({
        message: 'Coinbase provider not initialized'
      });
    }

    if (!user.isLinked()) {
      return done({
        message: 'Cannot send funds from an unlinked account'
      })
    }

    function makeRequest(next) {
      var params = props || {};
      params.access_token = user.coinbaseAccess;

      inst.api.transactions.send(next, params);
    }

    CoinbaseService.tokenRefresher(user, makeRequest, done);
  },

  tokenRefresher: function(user, action, done) {

    var retry = 2;

    function apiHandler(err, results) {

      if(err && err.status !== 401) {
        // Fail if a non-authentication error occurred
        return done(err);
      }
      if(err && err.status === 401 && --retry) {
        var options = {
          uri: 'https://coinbase.com/oauth/token',
          method: 'post',
          json: true,
          body: {
            grant_type: 'refresh_token',
            refresh_token: user.coinbaseRefresh,
            client_id: sails.config.coinbase.oauth.client,
            client_secret: sails.config.coinbase.oauth.secret
          }
        };
        console.log('REFRESHING TOKENS for '+user.username);
        // Refresh tokens if authentication failed and we can still retry
        return request(options, handleTokenRefresh);
      }
      // Either we've tried to refresh tokens too many times or we
      // got a successful result, so return results
      done(err, results);
    }

    function handleTokenRefresh(err, resp, tokens) {
      if (err) {
        // An error occurred refreshing tokens, so fail
        return done(err);
      }
      if (resp.statusCode === 200) {
        // Tokens successfully refreshed

        console.log('SAVING TOKENS for '+user.username,tokens);

        // Update user record with new tokens
        user.coinbaseAccess = tokens.access_token;
        user.coinbaseRefresh = tokens.refresh_token;
        user.save(function(err, savedUser) {
          // Retry API request now that tokens are updated
          action(apiHandler);
        });
        return;
      }
      // Some other failure happened
      done({
        error: err,
        status: resp.statusCode
      });
    }

    // Make API request
    action(apiHandler);

  }

};

