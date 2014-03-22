/**
 * Verb <https://github.com/assemble/verb>
 * Generate markdown documentation for GitHub projects.
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

/**
 * Get the current time using `.toISOString()`
 * @name function timetamp()
 * @return {String}
 * @api Public
 */

module.exports = function () {
  return new Date().toISOString();
};