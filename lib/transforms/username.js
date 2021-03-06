'use strict';

var un = require('../utils/username');

module.exports = function username(app) {
  var data = app.cache.data;

  data.username = typeof data.username === 'string'
    ? data.username
    : (data.repository && data.repository.url)
      ? un(data.repository.url)
      : (data.author && data.author.url)
        ? un(data.author.url) : '';

  if (data.username) {
    app.data({ username: data.username });
  }
};