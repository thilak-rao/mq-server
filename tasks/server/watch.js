"use strict"
module.exports = (gulp) => {
    const sourceFiles = './server/**/*.ts',
          testFiles   = './test/**/*.ts';

    return () => {
        gulp.watch([sourceFiles], ['tslint', 'compile']).on('change', (e) => {
            console.log('TypeScript file ' + e.path + ' has been changed. Compiling.')
        });

        gulp.watch([testFiles], ['tslint', 'compile']).on('change', (e) => {
            console.log('TypeScript test file ' + e.path + ' has been changed. Compiling.')
        });
    };
};
