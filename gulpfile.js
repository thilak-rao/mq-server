'use strict';
const gulp    = require('gulp'),
      plugins = require('gulp-load-plugins')(),
      getTask = (task) => {
          return require(`./tasks/${task}`)(gulp, plugins);
      };
/**
 * Server Side Gulp Tasks
 */
// Remove build directory.
gulp.task('clean', getTask('server/clean'));

// Lint all Server TypeScript files.
gulp.task('tslint', getTask('server/tslint'));

// Compile Server TypeScript sources and create sourcemaps in server directory.
gulp.task('compile', ['clean'], getTask('server/compile'));

// Watch for changes in TypeScript, HTML and CSS files.
gulp.task('watch', getTask('server/watch'));

// Copy mock files for tests
gulp.task('copymocks', ['cleantests'], getTask('server/copymocks'));

// Remove test and mocks directory from build folder.
gulp.task('cleantests', getTask('server/cleantests'));

// Compile Test TypeScript sources and create sourcemaps in test directory.
gulp.task('compiletests', ['build', 'copymocks'], getTask('server/compiletests'));

// Run server tests on Lap test suite for Hapi
gulp.task('test', ['compiletests'], getTask('server/test'));

// Run server locally using nodemon
gulp.task('start', ['build'], getTask('server/start'));

// Build the project.
gulp.task('build', ['compile'], () => {
    console.log('\n\n\n***** Building MagicQuill server *****\n');
});

/**
 * Client Side Gulp Tasks
 */
gulp.task('webpack:devserver', getTask('client/webpackdevserver'));
