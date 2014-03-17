'use strict';

module.exports = {

  findDonation: function(id, callbacks) {
    Donation.findOneById(id).exec(function(err, donation) {
      if (err) {
        return callbacks.done(err);
      }
      callbacks.done(null, donation);
    });
  }

};