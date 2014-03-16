module.exports = function(req, res, next) {
  console.log('removeUser');

  // Prevent the model's user from being changed
  if(req.body && req.body.user) {
    delete req.body.user;
  }

  return next();
};
