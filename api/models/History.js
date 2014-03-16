
/**
 * History
 *
 * @module      ::  Model
 * @description ::  History model which present specified object history data. Basically this
 *                  model is the _largest_ one in Taskboard application, because every object
 *                  writes history data on create / update events.
 * @docs        ::  http://sailsjs.org/#!documentation/models
 */
'use strict';

module.exports = {

  attributes: {
    // Reference to object, eg. User, Campaign, Donation, etc.
    objectName: {
      type:       'string',
      required:   true
    },
    // Reference to object id.
    objectId: {
      type:       'string',
      required:   true
    },
    objectData: {
      type:       'text',
      required:   true
    },
    message: {
      type:       'text'
    },
    // Relation to user id
    userId: {
      type:       'string',
      required:   true
    },

    // Dynamic data attributes

    createdAtObject: function () {
      return (this.createdAt && this.createdAt != '0000-00-00 00:00:00')
        ? DateService.convertDateObjectToUtc(this.createdAt) : null;
    },
    updatedAtObject: function () {
      return (this.updatedAt && this.updatedAt != '0000-00-00 00:00:00')
        ? DateService.convertDateObjectToUtc(this.updatedAt) : null;
    }
  }
};