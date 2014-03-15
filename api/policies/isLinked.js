module.exports = function(req, res, next) {

  // Make sure current user has coinbase tokens
  if (req.user && req.user.coinbaseAccess) {
    return next();
  }

  // User is not allowed
  return res.forbidden('error.noPermission');

};
