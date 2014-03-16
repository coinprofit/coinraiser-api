/**
 * Campaign
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    goal: {
      type: 'float',
      required: true
    },
    raised: {
      type: 'string',
      defaultsTo: '0'
    },
    pledged: {
      type: 'string',
      defaultsTo: '0'
    },
    logo: {
      type: 'string'
    },
    imageUrl1: {
      type: 'string'
    },
    imageUrl2: {
      type: 'string'
    },
    imageUrl3: {
      type: 'string'
    },
    user: {
      model: 'user',
      required: true
    },
    addressOwner: {
      type: 'string'
    },
    addressEscrow: {
      type: 'string'
    },
    donations: {
      collection: 'donation',
      via: 'campaign'
    },
  }

  // beforeCreate: function(values, next) {
  // },

  // beforeUpdate: function(values, next) {
  // },

};
