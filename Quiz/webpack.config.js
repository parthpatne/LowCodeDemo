var webpackConfig = require('../webpack.config.base');
module.exports = env => webpackConfig(env, {
    packageId: "com.microsoft.Quiz",
    entry: {
        "CreateView": "./src/CreateView.tsx",
        "UpdateView": "./src/UpdateView.tsx",
        "DetailView": "./src/DetailView.tsx"
    },
    copyAssets: [
        { from: "resources/package.json" },
        { from: "resources/color.png" },
        { from: "resources/cardView.json" }
    ]
});