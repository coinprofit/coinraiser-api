module.exports = function(req, res, next) {
  console.log('cleanUpdateUser');

  // Make sure that read-only properties cannot be modified via API calls
  if(req.body) {
    delete req.body.username;
  }
  return next();
};
