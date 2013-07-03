'use strict';
var fs = require('fs');
var disallowed = [
  '<<<<<<<',
  '=======',
  '>>>>>>>'
];

module.exports = function (grunt) {
  grunt.registerMultiTask('merge-conflict', 'Check for merge conflict markers', function () {
    var done = this.async();
    grunt.util.async.forEach(this.filesSrc, function (file, next) {
      file.src.forEach(function (file) {
        var lines = grunt.file.read(file).contents.split('\n');
        lines.forEach(function (line, num) {
          if (disallowed.indexOf(line.substr(0, 7)) !== -1) {
            grunt.log.errorlns(file + ' has merge conflict marker at line ' + (num + 1));
            next(true);
          }
        });
      });
      next();
    }, function (failed) {
      if (failed) {
        grunt.warn('merge-conflict check failed.');
      }
      done();
    });
  });
};
