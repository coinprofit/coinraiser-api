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
      type: 'integer',
      required: true
    },
    campaign: {
      type: 'integer',
      required: true
    },
    amount: {
      type: 'float',
      required: true
    }
  }

};
