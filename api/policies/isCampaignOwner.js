module.exports = function(req, res, next) {

  console.log('isCampaignOwner');

  var id = req.params.id;
  var user = req.user;

  // Load campaign
  Campaign.findOneById(id).populate('donations').exec(function(err, campaign) {

    if (err) {
      sails.log.error('Failed to find campaign', err);
      return res.badRequest(err);
    }

    console.log('campaign', campaign);

    // Check if the current user is the owner of this campaign

    if (campaign.user === user.id) {
      // Add loaded campaign to request
      req.campaign = campaign;
      return next();
    }

    res.badRequest({
      error: 'You must be the owner of this campaign to perform this action'
    });

  });

};
