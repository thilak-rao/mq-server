"use strict"
module.exports = (gulp, plugins) => {
    const testFiles = './test/**/*.ts',
          tsc       = require('gulp-typescript'),
          tsProject = tsc.createProject('./server/tsconfig.json'),
          output    = './build/';

    return () => {
        let stream = gulp.src([testFiles])
            .pipe(plugins.sourcemaps.init())
            .pipe(tsc(tsProject))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(output));

        return stream;
    };
};
