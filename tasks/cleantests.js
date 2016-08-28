"use strict"
module.exports = (gulp, plugins) => {
    const test = ['./build/test', './build/mocks'];

    return () => {
        const stream = gulp.src(test, {read: false})
            .pipe(plugins.rimraf());

        return stream;
    };
};
