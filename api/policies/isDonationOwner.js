module.exports = function(req, res, next) {

  console.log('isDonationOwner');

  var id = req.params.id;
  var user = req.user;

  // Load donation
  Donation.findOneById(id).populate('campaign').exec(function(err, donation) {

    if (err) {
      sails.log.error('Failed to find donation', err);
      return res.badRequest(err);
    }

    console.log('donation', donation);

    // Check if the current user is the owner of this campaign

    if (donation.user === user.id) {
      // Add loaded donation to request
      req.donation = donation;
      return next();
    }

    res.badRequest({
      error: 'You must be the owner of this donation to perform this action'
    });

  });

};
