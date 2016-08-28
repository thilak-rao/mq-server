"use strict"
module.exports = (gulp, plugins) => {
    const sourceFiles = './server/**/*.ts',
          tsc         = require('gulp-typescript'),
          tsProject   = tsc.createProject('./server/tsconfig.json'),
          output      = require('../server/tsconfig.json').compilerOptions.outDir;

    return () => {
        let stream = gulp.src([sourceFiles])
            .pipe(plugins.sourcemaps.init())
            .pipe(tsc(tsProject))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(output));

        return stream;
    };
};
