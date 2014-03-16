/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

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

    // --- Account security ---

    salt: {
      type: 'string'
    },
    locked: {
      type: 'boolean',
      defaultsTo: false
    },
    passwordFailures: {
      type: 'integer',
      defaultsTo: 0
    },
    lastPasswordFailure: {
      type: 'datetime'
    },
    resetToken: {
      type: 'string'
    },

    // --- User Activation ---

    // Token for email activation
    // See this project for integrating email, password reset, etc:
    // https://github.com/jdcauley/sailsjs-v010-boilerplate
    activationToken: {
      type: 'string'
    },
    activated: {
      type: 'boolean',
      defaultsTo: false
    },

    // --- Coinbase Tokens ---

    coinbaseAccess: {
      type: 'string'
    },
    coinbaseRefresh: {
      type: 'string'
    },

    // --- Collections --

    campaigns: {
      collection: 'campaign',
      via: 'user'
    },
    donations: {
      collection: 'donation',
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

    validatePassword: function(password, callback) {
      return PasswordService.validatePassword(this, password, callback);
    },

    isPermitted: function(permission) {
    },

    isLinked: function() {
      return this.coinbaseAccess ? true : false
    },

    toJSON: function() {
      var user = this.toObject();

      // console.log('toJSON',user);

      user.avatar = this.gravatarImage() || user.avatar;

      return _.omit(user,
        'password',
        'email',
        // 'coinbaseAccess',
        // 'coinbaseRefresh',
        'salt',
        'locked',
        'passwordFailures',
        'lastPasswordFailure',
        'resetToken'
      );
    }
  },

  beforeCreate: function(values, next) {
    PasswordService.hashPassword(values, next);

    // TOOD: Create activation token.
    // Example from https://github.com/jdcauley/sailsjs-v010-boilerplate/blob/master/api/models/User.js

    // crypto.generate({saltComplexity: 10}, user.password, function(err, hash){
    //   if(err){
    //     return cb(err);
    //   }else{
    //     user.password = hash;
    //     user.activated = false; //make sure nobody is creating a user with activate set to true, this is probably just for paranoia sake
    //     user.activationToken = crypto.token(new Date().getTime()+user.email);
    //     return cb(null, user);
    //   }
    // });
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
  }

  // afterCreate: function(values, callback) {
  //   HistoryService.write('User', values);
  //   callback();

  //   // TODO: Send activation email
  // },
  // afterUpdate: function(values, callback) {
  //   HistoryService.write('User', values);
  //   callback();

  //   // TOOD: If email changed, send activation email
  // },
  // afterDestroy: function(terms, callback) {
  //   // TODO: Should we really alloy entity to be destroyed? Probably shoul do a soft delete
  //   User
  //     .findOne(terms)
  //     .done(function(error, user) {
  //       if (error) {
  //         sails.log.error(error);
  //       } else {
  //         // TODO: Should we really remove history data when the entity is destroyed?
  //         HistoryService.remove('User', user.id);
  //       }

  //       callback();
  //     });
  // }

};
