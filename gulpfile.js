'use strict'
// Import Gulp Plugins
const gulp       = require('gulp'),
      rimraf     = require('gulp-rimraf'),
      tsc        = require('gulp-typescript'),
      sourcemaps = require('gulp-sourcemaps'),
      tslint     = require('gulp-tslint'),
      nodemon    = require('gulp-nodemon'),
      lab        = require('gulp-lab'),
      istanbul   = require('gulp-istanbul');

// Variables
const tsProject      = tsc.createProject('tsconfig.json'),
      sourceFiles    = 'src/**/*.ts',
      testFiles      = 'test/**/*.ts',
      publicFiles    = 'src/public/**/*',
      publicFilesOut = 'build/src/public',
      outDir         = require('./tsconfig.json').compilerOptions.outDir,
      entryPoint     = './build/src/server.js';

/**
 * Remove build directory.
 */
gulp.task('clean', () => {
    return gulp.src(outDir, { read: false })
        .pipe(rimraf())
})


/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
    return gulp.src(sourceFiles)
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
})

/**
 * Copy public files
 */
gulp.task('copy-public', ['compile'], () => {
    return gulp.src(publicFiles)
        .pipe(gulp.dest(publicFilesOut));
})

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task('compile', ['clean'], () => {
    let tsResult = gulp.src([sourceFiles, testFiles])
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject))
    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outDir))
})

/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch', () => {
    gulp.watch([sourceFiles], ['tslint', 'compile']).on('change', (e) => {
        console.log('TypeScript file ' + e.path + ' has been changed. Compiling.')
    });

    gulp.watch([testFiles], ['tslint', 'compile']).on('change', (e) => {
        console.log('TypeScript test file ' + e.path + ' has been changed. Compiling.')
    })

    gulp.watch([publicFiles], ['copy-public']).on('change', (e) => {
        console.log('Client side file ' + e.path + ' has been changed. Copying.')
    })
})

/**
 * Build the project.
 */
gulp.task('build', ['copy-public'], () => {
    console.log('Building the project ...')
})

gulp.task('test', ['build'], () => {
    return gulp.src(['build/test/**/*.js'], { read: false })
        .pipe(lab(['-v', '-C']))
        .once('error', () => {
            process.exit(1);
        })
        .once('end', () => {
            process.exit();
        });
})


gulp.task('nodemon', ['build'], () => {
    nodemon({
        script: entryPoint,
        env: { 'NODE_ENV': 'development' }
    })
})
