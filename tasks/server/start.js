"use strict"
module.exports = (gulp, plugins) => {
    const entry = './build/server/server.js';

    return () => {
        const stream = plugins.nodemon({
            script: entry,
            env: { 'NODE_ENV': 'development' }
        });

        return stream;
    };
};
