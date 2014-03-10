/**
 * Campaign
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    title: {
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
    logo: {
      type: 'string'
    },
    user: {
      type: 'integer',
      required: true
    }
  }

};
