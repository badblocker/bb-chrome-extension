const path = require('path');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
    entry: {
        background: './src/app/background.ts',
        main: './src/ui/main.tsx',
    },

    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

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
