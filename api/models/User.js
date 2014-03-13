/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

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
      type: 'email',
      required: true
    },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    language: {
      type: 'string',
      defaultsTo: 'en',
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
    campaigns: {
      collection: 'campaign',
      via: 'user'
    },
    donations: {
      collection: 'donation',
      via: 'user'
    },
    ious: {
      collection: 'iou',
      via: 'user'
    },

    // Dynamic data attributes

    // Computed user fullName string
    fullName: function() {
      return this.lastName + ' ' + this.firstName;
    },

    gravatarImage: function(size) {
      return GravatarService.getGravatarUrl(this.email, size);
    },

    validPassword: function(password, callback) {
      return PasswordService.validatePassword(this, password, callback);
    },

    isPermitted: function(permission) {
    },

    toJSON: function() {
      var user = this.toObject();
      user.avatar = this.gravatarImage();
      return _.omit(user,
        'password',
        'email',
        'coinbaseAccess',
        'coinbaseRefresh'
      );
    }
  },

  beforeCreate: function(values, next) {
    PasswordService.hashPassword(values, next);
  },

  beforeUpdate: function(values, next) {
    if (values.password) {
      PasswordService.hashPassword(values, next);
    }
    else if (values.id) {
      User
        .findOne(values.id)
        .done(function(err, user) {
          if (err) {
            next(err);
          }
          else {
            values.password = user.password;

            // Non-admin user cannot grant admin permissions to a user
            // if (values.admin && !user.admin) {
            //   values.admin = false;
            // }

            next();
          }
      });
    } else {
      next();
    }
  },

  afterCreate: function(values, callback) {
    HistoryService.write('User', values);
    callback();
  },
  afterUpdate: function(values, callback) {
    HistoryService.write('User', values);
    callback();
  },
  afterDestroy: function(terms, callback) {
    // TODO: Should we really alloy entity to be destroyed? Probably shoul do a soft delete
    User
      .findOne(terms)
      .done(function(error, user) {
        if (error) {
          sails.log.error(error);
        } else {
          // TODO: Should we really remove history data when the entity is destroyed?
          HistoryService.remove('User', user.id);
        }

        callback();
      });
  }

};
