"use strict"
module.exports = (gulp, plugins) => {
    const testFile = ['build/test/**/*.js'];

    return () => {
        const stream = gulp.src(testFile, {read: false})
            .pipe(plugins.lab(['-v', '-C']))
            .once('error', () => {
                process.exit(1);
            })
            .once('end', () => {
                process.exit();
            });

        return stream;
    };
};
