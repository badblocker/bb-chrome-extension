const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        background: './src/app/background.ts',
        main: './src/ui/main.tsx',
    },

    output: {
        path: path.resolve(__dirname, `dist/js`),
        filename: '[name].js'
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './src/app/recordList.json', to: `.` },
                { from: './src/app/searchList.json', to: `.` }
            ]
        })
    ],
    module: {
        rules: [
            
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
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
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                  name: '../fonts/[name].[ext]'
                }
            }
            // {
            //     test: /\.svg$/,
            //     use: {
            //         loader: "svg-url-loader",
            //         options: {
            //             name: '../img/[name].[ext]',
            //             limit: 10000
            //         },
            //     },
            // },
            
        ]
    },
};
