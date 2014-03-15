
'use strict';

var coinapi = require('coinapi');
var Provider = coinapi.Provider;
var coinbaseDef = coinapi.definitions.coinbase;

var CoinbaseProvider = Provider.createClass({
  definition: coinbaseDef,
  requestDefaults: {}
});

var inst;

module.exports = {
  initialize: function(credentials) {
    inst = new CoinbaseProvider(credentials || sails.config.coinbase.api);

    // this.getBalance(null, function(err, results) {
    //   console.log('coinbase balance',err, results);
    // });

    // this.getAccount(null, function(err, results) {
    //   console.log('coinbase account',err, results);
    // });

  },

  getBalance: function(accessToken, callback) {
    if (!inst) {
      return callback({
        message: 'Coinbase provider not initialized'
      });
    }

    var params = {};
    if (accessToken) {
      params.access_token = accessToken;
    }

    inst.api.account.balance(function(err, results) {
      console.log('coinbase balance',err, results);
      callback(null, results);
    },params);

  },

  getAccount: function(accessToken, callback) {
    if (!inst) {
      return callback({
        message: 'Coinbase provider not initialized'
      });
    }

    var params = {};
    if (accessToken) {
      params.access_token = accessToken;
    }

    inst.api.account.changes(function(err, results) {
      console.log('coinbase account',err, results);
      callback(null, results);
    },params);

  },

  createReceiveAddress: function(accessToken, callback) {
    if (!inst) {
      return callback({
        message: 'Coinbase provider not initialized'
      });
    }

    var params = {};
    if (accessToken) {
      params.access_token = accessToken;
    }

    inst.api.account.receiveAddress.create(function(err, results) {
      console.log('coinbase create receive address',err, results);
      callback(null, results);
    },params);

  }


};

