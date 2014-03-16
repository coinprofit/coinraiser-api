module.exports = function(req, res, next) {
  console.log('cleanUser');

  // Make sure that read-only properties cannot be modified via API calls
  if(req.body) {
    delete req.body.salt;
    delete req.body.locked;
    delete req.body.passwordFailures;
    delete req.body.lastPasswordFailure;
    delete req.body.resetToken;
    delete req.body.activationToken;
    delete req.body.activated;
    delete req.body.coinbaseAccess;
    delete req.body.coinbaseRefresh;
  }
  return next();
};
