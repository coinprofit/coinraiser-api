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
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true
    },
    provider: {
      type: 'string'
    },
    provider_id:{
      type: 'string'
    },
    coinbase_access: 'string',
    coinbase_refresh: 'string'
  }

};
