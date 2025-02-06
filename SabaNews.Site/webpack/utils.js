const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pathConfig = require('./config/path');

exports.setDefinePlugin = function (key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    };
};

exports.extractCSS = function (isProduction) {
    const env = isProduction ? 'pro' : 'dev';
    const jsPath = `${pathConfig.scriptPaths.build}/${env}/lib`;
    return {
        plugins: [
            new MiniCssExtractPlugin({ filename: '[name].min.css', chunkFilename: jsPath + '/[name].min.css' })
        ],
        module: {
            rules: [
                {
                    test: /\.(sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader?url=false',
                        'sass-loader'
                    ]
                },
                // {
                //     test: /\.(woff|ttf|otf|eot|woff2|svg)$/i,
                //     loader: "file-loader",
                //     options: {
                //         name: '[name].[ext]',
                //         outputPath: '/wwwroot/font/'
                //     }

            ]
        }
    };
};