module.exports = function(req, res, next) {
  console.log('cleanUpdateDonation');

  // Make sure that read-only properties cannot be modified via API calls
  if(req.body) {
    delete req.body.amount;
  }
  return next();
};
