"use strict"
module.exports = (gulp) => {
    const mockFiles    = './mocks/**/*',
          mockFilesOut = './build/mocks';

    return () => {
        const stream = gulp.src(mockFiles)
            .pipe(gulp.dest(mockFilesOut));

        return stream;
    };
};
