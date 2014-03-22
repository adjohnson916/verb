/**
 * Verb <https://github.com/assemble/verb>
 * Generate markdown documentation for GitHub projects.
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

// node_modules
var file = require('fs-utils');
var toc = require('marked-toc');
var template = require('template');
var relative = require('relative');
var matter = require('gray-matter');
var _ = require('lodash');

/**
 * Custom TOC template for marked-toc
 * @type  {String}
 */

var tmpl = '<%= depth %><%= bullet %>[<%= heading %>](<%= url %>)\n';


/**
 * Table of Contents
 *
 * @param {Function} verb
 * @return {String} table of contents
 */

module.exports = function(verb) {
  var verbOpts = _.extend({sep: '\n'}, verb.options);

  var stack = [];

  exports.toc = function(src, options) {

    var renderedTOC = '';

    /**
     * If source file patterns are provided, then read in the array
     * of files and generate a single Table of Contents for all files
     * in the array. Also, extend the object returned by marked-toc
     * with additional properties for each file
     */

    if(src) {

      // Extend TOC options with verb options
      var opts = _.extend(verbOpts, {toc: {firsth1: true}}, options);
      var tocOpts = _.defaults({template: tmpl}, opts.toc);

      /**
       * Generate the multi-file TOC
       * @param {String} filepath
       * @return {String} Table of Contents
       */

      renderedTOC = file.expand(src, opts.glob).map(function(filepath) {
        var dest = verb.cwd(opts.dest || opts.destBase || '');

        // Build a relative link to each file
        var link = relative(dest || verb.cwd(), filepath);

        // Get a 'pretty' name for each file for use in the TOC
        var name = file.name(filepath);

        // Remove "docs-" and other junk from headings
        var safe = _.safename(name, {omit: 'docs', blacklist: false});

        // Read in the file excluding front matter
        var content = matter.read(filepath).content;

        // Actually create the TOC. `toc.raw` returns an object instead
        // of a string, so that we can extend it.
        var md = toc.raw(content, tocOpts);

        // Extend the object returned by marked-toc with relative
        // links and section links, so we can generate the TOC
        // from our custom template.
        var output = md.data.map(function (obj) {
          obj = _.extend(obj, {
            url: link + '/#' + obj.url
          });
          return template(tmpl, obj);
        }).join('');

        // Reconstruct the "section" headings using sanitized
        // versions of the filenames.
        var heading = _.str.titleize(safe);
        var section = '# [' + heading + '](' + link + ')\n\n';

        // Render our new TOC
        return section + output;
      }).join(opts.sep);
    } else {


      /**
       * If no src patterns are passed in, just render the TOC from
       * the content of the current page.
       */

      renderedTOC = toc(verb.page.content);
    }

    stack.push(renderedTOC);
    return renderedTOC;
  };

  exports.toc.async = function (callback) {
    callback(null, stack.pop());
  };

  return exports;
};