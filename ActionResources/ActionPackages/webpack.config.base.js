const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CrossoriginWebpackPlugin = require('crossorigin-webpack-plugin')
 
module.exports = (env, props) => {
    var config = {
        entry: props.entry,
        output: {
            path: path.resolve(__dirname, `../../KasWeb/wwwroot/ActionPackages/${props.packageId}/`),
            filename: "[name].[contenthash].js"
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    Vendor: {
                        test: /node_modules[\\/]/,
                        enforce: true,
                        name: 'Vendor',
                        chunks: 'all',
                        priority: 1,
                    },
                    OfficeFabric: {
                        test: /node_modules[\\/]((office|@uifabric).*)[\\/]/,
                        enforce: true,
                        name: 'OfficeFabric',
                        chunks: 'all',
                        priority: 2,
                    },
                    StardustUI: {
                        test: /node_modules[\\/]((@stardust-ui))[\\/]/,
                        enforce: true,
                        name: 'StardustUI',
                        chunks: 'all',
                        priority: 2
                    },
                    StardustUITheme: {
                        test: /node_modules[\\/]((@stardust-ui).*(themes).*)[\\/]/,
                        enforce: true,
                        name: 'StardustUITheme',
                        chunks: 'all',
                        priority: 3
                    },
                    ActionSDK: {
                        test: /ActionSDK[\\/]/,
                        enforce: true,
                        name: 'ActionSDK',
                        chunks: 'all',
                        priority: 2
                    },
                    SharedUI: {
                        test: /SharedUI[\\/]/,
                        enforce: true,
                        name: 'SharedUI',
                        chunks: 'all',
                        priority: 0
                    },
                }
            }
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
            alias: {
                "@actionCommon": path.resolve(__dirname, "../ActionCommon/src"),
                "@actionSDK": path.resolve(__dirname, "../ActionSDK/src"),
                "@sharedUI": path.resolve(__dirname, "./SharedUI/src/")
            }
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.scss$/,
                loader: [
                    require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('sass-loader')
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                loader: 'file-loader'
            }]
        }
    }

    // Webpack plugins
    config.plugins = [];

    // For each entry there will be one html file
    var entries = Object.keys(props.entry);
    for (var entry of entries) {
        // Exclude other entries from this html
        var excludeChunks = entries.filter(x => x != entry);
        config.plugins.push(new HtmlWebpackPlugin({
            templateContent: '<div id="root"></div>',
            filename: `${entry}.html`,
            excludeChunks: excludeChunks
        }));
    }
    // Process other assets
    var copyAssets = [
        { from: 'strings/**/*' },
        { from: 'assets/*' }
    ];
    if (props.copyAssets) {
        copyAssets = [...copyAssets, ...props.copyAssets];
    }
    config.plugins.push(new CopyWebpackPlugin(copyAssets));
    config.plugins.push(new CrossoriginWebpackPlugin({ crossorigin: 'anonymous' }));

    if (env.mode === 'dev') {
        config.mode = 'development';
        config.devtool = 'cheap-module-source-map';
    } else {
        config.mode = 'production'
    }

    if (env.watch === 'true') {
        config.watch = true;
    } else {
        config.watch = false;
    }

    return config;
};