'use strict';
const gulp    = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      getTask = (task) => {
          return require(`./tasks/${task}`)(gulp, plugins);
      };

// Remove build directory.
gulp.task('clean', getTask('clean'));

// Lint all Server TypeScript files.
gulp.task('tslint', getTask('tslint'));

// Compile Server TypeScript sources and create sourcemaps in server directory.
gulp.task('compile', ['clean'], getTask('compile'));

// Watch for changes in TypeScript, HTML and CSS files.
gulp.task('watch', getTask('watch'));

// Copy mock files for tests
gulp.task('copymocks', ['cleantests'], getTask('copymocks'));

// Remove test and mocks directory from build folder.
gulp.task('cleantests', getTask('cleantests'));

// Compile Test TypeScript sources and create sourcemaps in test directory.
gulp.task('compiletests', ['build', 'copymocks'], getTask('compiletests'));

// Run server tests on Lap test suite for Hapi
gulp.task('test', ['compiletests'], getTask('test'));

// Run server locally using nodemon
gulp.task('start', ['build'], getTask('start'));

// Build the project.
gulp.task('build', ['compile'], () => {
    console.log('\n\n\n***** Building MagicQuill server *****\n');
});
