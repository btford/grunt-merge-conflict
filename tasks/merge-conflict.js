'use strict';

var disallowed = [
  '<<<<<<<',
  '=======',
  '>>>>>>>'
];

var fs = require('fs');

module.exports = function (grunt) {

  grunt.registerMultiTask('merge-conflict', 'Check for merge conflict markers', function () {
    var failed = false;
    this.files.forEach(function (glob) {
      glob.src
        .filter(function (file) {
          return fs.statSync(file).isFile();
        })
        .map(function (file) {
          return {
            name: file,
            contents: grunt.file.read(file)
          };
        })
        .forEach(function (file) {
          var lines = file.contents.split('\n');
          lines.forEach(function (line, num) {
            if (disallowed.indexOf(line.substr(0, 7)) !== -1) {
              grunt.log.errorlns(file.name + ' has merge conflict marker at line ' + (num + 1));
              failed = true;
            }
          });
        });
    });
    if (failed) {
      grunt.fail.fatal('merge-conflict check failed.');
    }
  });
};
