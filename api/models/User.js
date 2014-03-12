/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');
var _ = require('lodash');

module.exports = {

  attributes: {

    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true
    },
    // provider: {
    //   type: 'string'
    // },
    // provider_id:{
    //   type: 'string'
    // },
    coinbaseAccess: 'string',
    coinbaseRefresh: 'string',
    // campaigns: {
    //   collection: 'Campaign',
    //   via: 'campaign'
    // },
    // donations: {
    //   collection: 'Donation',
    //   via: 'donation'
    // },
    // ious: {
    //   collection: 'Iou',
    //   via: 'iou'
    // },
    toJSON: function() {
      return _.omit(this.toObject(), 'password', 'email', 'coinbaseAccess', 'coinbaseRefresh');
    }
  },

  beforeCreate: function(user, next) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          next(err);
        }else{
          user.password = hash;
          next(null, user);
        }
      });
    });
  },

  isPermitted: function(permission) {

  }

};
