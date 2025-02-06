const alias = require('../config/alias');
const pathConfig = require('../config/path');
const pluginGenerator = require('../config/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

function generateConfig(environment) {
    const jsPath = `${pathConfig.scriptPaths.build}/${environment}`;
    const cssPath = `${pathConfig.cssPaths.build}/${environment}`;
    return {
        resolve: {
            alias: alias,
            extensions: ['.js', '.jsx']
        },
        entry: {
            /*js*/
            [`${jsPath}/lib/lang-vi-VN`]: pathConfig.scriptPaths.language,
            [`${jsPath}/pages/livescore/soccer/index`]: pathConfig.scriptPaths.livescore_soccer_index,
            [`${jsPath}/pages/livescore/soccer/league-detail`]: pathConfig.scriptPaths.livescore_soccer_league_detail,
            [`${jsPath}/pages/livescore/soccer/detail`]: pathConfig.scriptPaths.livescore_soccer_detail,
            [`${jsPath}/pages/livescore/soccer/favourite-match`]: pathConfig.scriptPaths.livescore_soccer_favourite_match,
            [`${jsPath}/pages/livescore/soccer/favourite-league`]: pathConfig.scriptPaths.livescore_soccer_favourite_league,
            [`${jsPath}/pages/livescore/soccer/world-cup/fixture`]: pathConfig.scriptPaths.livescore_soccer_worldcup_fixture,
            [`${jsPath}/pages/livescore/soccer/world-cup/full-fixture`]: pathConfig.scriptPaths.livescore_soccer_worldcup_full_fixture,
            [`${jsPath}/pages/livescore/soccer/world-cup/standing-playoff`]: pathConfig.scriptPaths.livescore_soccer_worldcup_standing_playoff,
            [`${jsPath}/pages/livescore/soccer/world-cup/minigame-stage`]: pathConfig.scriptPaths.livescore_soccer_worldcup_minigame_stage,
            [`${jsPath}/pages/livescore/soccer/world-cup/minigame-standing`]: pathConfig.scriptPaths.livescore_soccer_worldcup_minigame,
            [`${jsPath}/pages/livescore/soccer/world-cup/minigame-detail-stage`]: pathConfig.scriptPaths.livescore_soccer_worldcup_minigame_detail_stage,
            [`${jsPath}/pages/livescore/soccer/world-cup/minigame-detail`]: pathConfig.scriptPaths.livescore_soccer_worldcup_minigame_detail,
            [`${jsPath}/pages/livescore/soccer/world-cup/minigame-winner`]: pathConfig.scriptPaths.livescore_soccer_worldcup_minigame_winner,
            [`${jsPath}/pages/livescore/soccer/homepage/fixture`]: pathConfig.scriptPaths.livescore_soccer_homepage_fixture,
            [`${jsPath}/pages/livescore/soccer/homepage/standing`]: pathConfig.scriptPaths.livescore_soccer_homepage_standing,
            [`${jsPath}/pages/livescore/soccer/category/standing`]: pathConfig.scriptPaths.livescore_soccer_category_standing,
            [`${jsPath}/pages/livescore/soccer/category/fixture`]: pathConfig.scriptPaths.livescore_soccer_category_fixture,
            [`${jsPath}/pages/livescore/soccer/match-detail-shortcut`]: pathConfig.scriptPaths.livescore_soccer_match_detail_shortcut,
            [`${jsPath}/pages/livescore/soccer/post-detail-matches`]: pathConfig.scriptPaths.livescore_soccer_post_detail_fixture,
            [`${jsPath}/pages/livescore/soccer/euro-2024/fixture`]: pathConfig.scriptPaths.livescore_soccer_euro2024_fixture,
            [`${jsPath}/pages/livescore/soccer/euro-2024/match-detail`]: pathConfig.scriptPaths.livescore_soccer_euro2024_match_detail,
            [`${jsPath}/pages/livescore/soccer/euro-2024/full-fixture`]: pathConfig.scriptPaths.livescore_soccer_euro2024_full_fixture,
            [`${jsPath}/pages/livescore/soccer/euro-2024/standing`]: pathConfig.scriptPaths.livescore_soccer_euro2024_standing,
            [`${jsPath}/pages/livescore/soccer/euro-2024/team-detail`]: pathConfig.scriptPaths.livescore_soccer_euro2024_team_detail,
            [`${jsPath}/pages/livescore/soccer/euro-2024/minigame-standing`]: pathConfig.scriptPaths.livescore_soccer_euro2024_minigame_standing,
            [`${jsPath}/pages/livescore/soccer/euro-2024/minigame-winner`]: pathConfig.scriptPaths.livescore_soccer_euro2024_minigame_winner,
            [`${jsPath}/pages/livescore/soccer/euro-2024/minigame-stage`]: pathConfig.scriptPaths.livescore_soccer_euro2024_minigame_stage,
            [`${jsPath}/pages/livescore/soccer/euro-2024/minigame-profile`]: pathConfig.scriptPaths.livescore_soccer_euro2024_minigame_profile,
            [`${jsPath}/pages/livescore/soccer/euro-2024/minigame-profile-stage`]: pathConfig.scriptPaths.livescore_soccer_euro2024_minigame_profile_stage,
            

            /*css*/
            [`${cssPath}/pages/livescore/soccer/index`]: pathConfig.cssPaths.livescore_soccer_index,
            [`${cssPath}/pages/livescore/soccer/league-detail`]: pathConfig.cssPaths.livescore_soccer_league_detail,
            [`${cssPath}/pages/livescore/soccer/detail`]: pathConfig.cssPaths.livescore_soccer_detail,
            [`${cssPath}/pages/livescore/soccer/favourite-match`]: pathConfig.cssPaths.livescore_soccer_favourite_match,
            [`${cssPath}/pages/livescore/soccer/favourite-league`]: pathConfig.cssPaths.livescore_soccer_favourite_league,
            [`${cssPath}/pages/livescore/soccer/world-cup/fixture`]: pathConfig.cssPaths.livescore_soccer_worldcup_fixture,
            [`${cssPath}/pages/livescore/soccer/world-cup/full-fixture`]: pathConfig.cssPaths.livescore_soccer_worldcup_full_fixture,
            [`${cssPath}/pages/livescore/soccer/world-cup/standing-playoff`]: pathConfig.cssPaths.livescore_soccer_worldcup_standing_playoff,
            [`${cssPath}/pages/livescore/soccer/world-cup/minigame-stage`]: pathConfig.cssPaths.livescore_soccer_worldcup_minigame_stage,
            [`${cssPath}/pages/livescore/soccer/world-cup/minigame-standing`]: pathConfig.cssPaths.livescore_soccer_worldcup_minigame,
            [`${cssPath}/pages/livescore/soccer/world-cup/minigame-detail-stage`]: pathConfig.cssPaths.livescore_soccer_worldcup_minigame_detail_stage,
            [`${cssPath}/pages/livescore/soccer/world-cup/minigame-detail`]: pathConfig.cssPaths.livescore_soccer_worldcup_minigame_detail,
            [`${cssPath}/pages/livescore/soccer/world-cup/minigame-winner`]: pathConfig.cssPaths.livescore_soccer_worldcup_minigame_winner,
            [`${cssPath}/pages/livescore/soccer/homepage/fixture`]: pathConfig.cssPaths.livescore_soccer_homepage_fixture,
            [`${cssPath}/pages/livescore/soccer/homepage/standing`]: pathConfig.cssPaths.livescore_soccer_homepage_standing,
            [`${cssPath}/pages/livescore/soccer/category/standing`]: pathConfig.cssPaths.livescore_soccer_category_standing,
            [`${cssPath}/pages/livescore/soccer/category/fixture`]: pathConfig.cssPaths.livescore_soccer_category_fixture,
            [`${cssPath}/pages/livescore/soccer/match-detail-shortcut`]: pathConfig.cssPaths.livescore_soccer_match_detail_shortcut,
            [`${cssPath}/pages/livescore/soccer/post-detail`]: pathConfig.cssPaths.livescore_soccer_post_detail_fixture,
            [`${cssPath}/pages/livescore/soccer/euro-2024/fixture`]: pathConfig.cssPaths.livescore_soccer_euro2024_fixture,
            [`${cssPath}/pages/livescore/soccer/euro-2024/match-detail`]: pathConfig.cssPaths.livescore_soccer_euro2024_match_detail,
            [`${cssPath}/pages/livescore/soccer/euro-2024/standing`]: pathConfig.cssPaths.livescore_soccer_euro2024_standing,
            [`${cssPath}/pages/livescore/soccer/euro-2024/full-fixture`]: pathConfig.cssPaths.livescore_soccer_euro2024_full_fixture,
            [`${cssPath}/pages/livescore/soccer/euro-2024/team-detail`]: pathConfig.cssPaths.livescore_soccer_euro2024_team_detail,
            [`${cssPath}/pages/livescore/soccer/euro-2024/minigame-standing`]: pathConfig.cssPaths.livescore_soccer_euro2024_minigame_standing,
            [`${cssPath}/pages/livescore/soccer/euro-2024/minigame-winner`]: pathConfig.cssPaths.livescore_soccer_euro2024_minigame_winner,
            [`${cssPath}/pages/livescore/soccer/euro-2024/minigame-stage`]: pathConfig.cssPaths.livescore_soccer_euro2024_minigame_stage,
            [`${cssPath}/pages/livescore/soccer/euro-2024/minigame-profile`]: pathConfig.cssPaths.livescore_soccer_euro2024_minigame_profile,
            [`${cssPath}/pages/livescore/soccer/euro-2024/minigame-profile-stage`]: pathConfig.cssPaths.livescore_soccer_euro2024_minigame_profile_stage,
        },
        output: {
            path: pathConfig.projectRoot,
            filename: "[name].chunk.js",
            chunkFilename: `${jsPath}/lib/[name].chunk.js`
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: ["babel-loader"],
                    exclude: /node_modules/
                }
            ]
        },
        plugins: pluginGenerator(environment),
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
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                maxSize: 0,
                minChunks: 2,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                name: false,
                cacheGroups: {
                    // disable default cache group
                    default: false,
                    vendors: false,
                    reactVendor: {
                        name: 'react-vendor',
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        minChunks: 2,
                        priority: -10
                    },
                    reactBootstrapVendor: {
                        name: 'react-bootstrap-vendor',
                        test: /[\\/]node_modules[\\/](react-bootstrap)[\\/]/,
                        minChunks: 2,
                        priority: -10
                    }
                }
            }
        }
    };
}

module.exports = generateConfig;