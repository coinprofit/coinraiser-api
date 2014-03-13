module.exports = function(req, res, next) {
  console.log('isNotCollection', req.params);
  // Make sure request is for a single entity, not for a collection of entities
  if (!req.params.id) {
    return res.forbidden('error.noPermission');
  }
  return next();
};
