const path = require('path');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
    entry: {
        background: './src/app/background.ts',
        blocker: './src/ui/blocker.tsx',
    },

    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js",".css"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '../img/[name].[ext]'
                }
            },
            { 
                test: /\.css$/, 
                use: [
                    'style-loader', 
                    'css-loader',
                    "postcss-loader"
                ] 
            },
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                    limit: 10000,
                    name: '../img/[name].[ext]'
                },
            }
        ]
    },
};
