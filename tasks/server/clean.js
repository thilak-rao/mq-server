"use strict"
module.exports = (gulp, plugins) => {
    const output = require('../../server/tsconfig.json').compilerOptions.outDir;

    return () => {
        const stream = gulp.src(output, {read: false})
            .pipe(plugins.rimraf());

        return stream;
    };
};
