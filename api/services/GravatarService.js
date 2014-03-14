'use strict';

var gravatar = require('gravatar');

exports.getGravatarUrl = function(email, size) {
  size = size || 25;
  if (!email) {
    return;
  }
  return gravatar.url(email, {s: size, r: 'pg', d: 'mm'}, true);
};
