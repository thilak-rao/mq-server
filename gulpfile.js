'use strict';
// Import Gulp Plugins
const gulp       = require('gulp'),
      rimraf     = require('gulp-rimraf'),
      tsc        = require('gulp-typescript'),
      sourcemaps = require('gulp-sourcemaps'),
      tslint     = require('gulp-tslint'),
      nodemon    = require('gulp-nodemon'),
      lab        = require('gulp-lab');

// Variables
const tsProject      = tsc.createProject('tsconfig.json'),
      sourceFiles    = 'server/**/*.ts',
      testFiles      = 'test/**/*.ts',
      mockFiles      = 'mocks/**/*',
      mockFilesOut   = 'build/mocks',
      outDir         = require('./tsconfig.json').compilerOptions.outDir,
      entryPoint     = './build/server/server.js';

/**
 * Remove build directory.
 */
gulp.task('clean', () => {
    return gulp.src(outDir, { read: false })
        .pipe(rimraf())
});


/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
    return gulp.src(sourceFiles)
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task('compile', ['clean'], () => {
    let tsResult = gulp.src([sourceFiles, testFiles])
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outDir))
});

/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch', () => {
    gulp.watch([sourceFiles], ['tslint', 'compile']).on('change', (e) => {
        console.log('TypeScript file ' + e.path + ' has been changed. Compiling.')
    });

    gulp.watch([testFiles], ['tslint', 'compile']).on('change', (e) => {
        console.log('TypeScript test file ' + e.path + ' has been changed. Compiling.')
    });
});

/**
 * Build the project.
 */
gulp.task('build', ['compile'], () => {
    console.log('Building the project ...')
});

/**
 * Copy mock files for tests
 */
gulp.task('copy-mocks', ['build'], () => {
    return gulp.src(mockFiles)
        .pipe(gulp.dest(mockFilesOut));
});

gulp.task('test', ['copy-mocks'], () => {
    return gulp.src(['build/test/**/*.js'], { read: false })
        .pipe(lab(['-v', '-C']))
        .once('error', () => {
            process.exit(1);
        })
        .once('end', () => {
            process.exit();
        });
});


gulp.task('nodemon', ['build'], () => {
    nodemon({
        script: entryPoint,
        env: { 'NODE_ENV': 'development' }
    })
});
