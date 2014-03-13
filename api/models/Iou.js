/**
 * Iou
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    user: {
      model: 'user'
    },
    campaign: {
      model: 'campaign'
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
