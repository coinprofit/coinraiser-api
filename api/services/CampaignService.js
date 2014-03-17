'use strict';

module.exports = {

  findCampaign: function(id, callbacks) {
    Campaign.findOneById(id).populate('donations').exec(function(err, campaign) {
      if (err) {
        return callbacks.done(err);
      }
      callbacks.done(null, campaign);
    });
  }

};