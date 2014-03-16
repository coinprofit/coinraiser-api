module.exports = function(req, res, next) {
  console.log('cleanCampaign');

  // Make sure that read-only properties cannot be modified via API calls

  return next();
};
