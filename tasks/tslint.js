"use strict"
module.exports = (gulp, plugins) => {
    const files = './server/**/*.ts';

    return () => {
        const stream = gulp.src(files)
            .pipe(plugins.tslint({
                foramatter: "verbose"
            }))
            .pipe(plugins.tslint.report());

        return stream;
    };
};
