module.exports = function(req, res, next) {
  console.log('useCurrentUser');

  // Make sure that the user specified is the current user
  if(req.body && req.body.user) {
    req.body.user = req.user.id;
  }
  return next();
};
