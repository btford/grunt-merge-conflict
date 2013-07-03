'use strict';

var disallowed = [
  '<<<<<<<',
  '=======',
  '>>>>>>>'
];

module.exports = function (grunt) {

  grunt.registerMultiTask('merge-conflict', 'Check for merge conflict markers', function () {
    var failed = false;
    this.files.forEach(function (glob) {
      glob.src
        .map(function (file) {
          return {
            name: file,
            contents: grunt.file.read(file)
          };
        })
        .forEach(function (file) {
          disallowed.forEach(function (thing) {
            if (file.contents.indexOf(thing) !== -1) {
              var line = file.contents.substr(0, file.contents.indexOf(thing)).split('\n').length;
              grunt.log.errorlns(file.name + ' has merge conflict marker at line ' + line);
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
