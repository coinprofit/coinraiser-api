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
      type: 'string',
      required: true
    },
    comment: {
      type: 'string'
    },
    transaction: {
      type: 'json'
    },

    // This donation is just a pledge if no transaction data has been stored with it
    isPledge: function() {
      return this.transaction ? false : true;
    }
  }

};

