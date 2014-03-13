'use strict';

var bcrypt = require('bcrypt');

exports.hashPassword = function(obj, next) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(obj.password, salt, function(err, hash) {
      if (err) {
        console.log(err);
        next(err);
      }else{
        obj.password = hash;
        next(null, obj);
      }
    });
  });
};

exports.validatePassword = function(obj, password, done) {
  obj = obj.toObject ? obj.toObject() : obj;
  if (done) {
    return bcrypt.compare(password, obj.password, done);
  }
  return bcrypt.compareSync(password, obj.password);
};
