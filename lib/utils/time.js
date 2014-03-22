/**
 * Verb <https://github.com/assemble/verb>
 * Generate markdown documentation for GitHub projects.
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var colors = require('../colors');

/**
 * ## function time()
 * Get the current time using `.toLocaleTimeString()`.
 *
 * @return {String}
 * @api Public
 */

module.exports = function() {
  var time = new Date().toLocaleTimeString();
  return colors.bgBlack.white(time) + ' ';
};