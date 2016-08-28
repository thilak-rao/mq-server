"use strict"
const webpack          = require("webpack"),
      gutil            = require('gulp-util'),
      WebpackDevServer = require("webpack-dev-server"),
      webpackConfig    = require('../../client/webpack.config.js');

module.exports = (gulp, plugins) => {
    return () => {
        const compiler = webpack(webpackConfig);
        new WebpackDevServer(compiler, {
            stats: { colors: true }
        }).listen(8080, 'localhost', (error, stats) => {
            if (error) {
                throw new gutil.PluginError("[webpack-dev-server]", error);
            }
        });
    };
};
