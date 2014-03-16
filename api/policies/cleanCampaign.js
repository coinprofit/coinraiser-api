module.exports = function(req, res, next) {
  console.log('cleanCampaign');

  // Make sure that read-only properties cannot be modified via API calls
  if(req.body) {
    delete req.body.raised;
    delete req.body.pledged;
    delete req.body.address;
    delete req.body.donations;
  }
  return next();
};
