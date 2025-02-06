const pathConfig = require('./config/path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const pluginGenerator = require('./config/plugin');
const webpack = require('webpack')


function generateConfig(environment) {
    const jsPath = `${pathConfig.scriptPaths.build}/${environment}`;
    const cssPath = `${pathConfig.cssPaths.build}/${environment}`;
    return {
        entry: {
            [`${jsPath}/site`]:
            [
                "/wwwroot/lib/jquery/dist/jquery.min.js",
                "/wwwroot/lib/bootstrap/dist/js/bootstrap-modal.min.js",
                "/wwwroot/js/common.js",
                "/wwwroot/js/site.js",
                "/wwwroot/js/all.js",
                "/wwwroot/js/auth/auth.js",
                "/wwwroot/js/post/load-component.js"
            ],
            [`${cssPath}/home`]:
            [
                "/wwwroot/styles/pages/home.css",
                "/wwwroot/styles/vendor/icomoon/style.css",
            ],
            [`${cssPath}/news`]:
            [
                "/wwwroot/styles/pages/news.css",
                "/wwwroot/styles/vendor/icomoon/style.css"
            ]
        },
        output: {
            path: pathConfig.projectRoot,
            filename: "[name].min.js",
            publicPath: "/",
        },
        resolve: {
            extensions: [".js", ".ts"],
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            })
        ],
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: ["babel-loader"],
                    exclude: /node_modules/
                },
            ]
        },
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            children: true
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: true,
                    uglifyOptions: {
                        output: {
                            comments: false
                        }
                    }
                }),
                new OptimizeCssAssetsPlugin()
            ],
        }
    }
}
module.exports = generateConfig;