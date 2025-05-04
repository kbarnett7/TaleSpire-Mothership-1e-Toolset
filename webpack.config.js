const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: [/node_modules/, /\.d\.ts$/],
            },
            {
                test: /\.html$/i,
                use: ["raw-loader"],
            },
            {
                test: /\.s?css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
                exclude: /\.module\.s?(c|a)ss$/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "./",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                },
            }),
        ],
    },
    devServer: {
        static: path.join(__dirname, "/"),
        compress: true,
        port: 4000,
        historyApiFallback: true, // SPA
    },
};
