/**
 * Donation
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    user: {
      model: 'user',
      required: true
    },
    campaign: {
      model: 'campaign',
      required: true
    },
    amount: {
      type: 'float',
      required: true
    },
    comment: {
      type: 'string'
    }
  }

};

