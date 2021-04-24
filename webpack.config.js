const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = (_, argv) => {
    var isProd = argv.mode === "production";
    return {
        entry: "./src/index.ts",
        mode: isProd ? "production" : "development",
        devtool: isProd ? false : "inline-source-map",
        devServer: {
            open: true,
            watchOptions: {
                ignored: ["node_modules/**"],
            },
            contentBase: "./dist",
            compress: true,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
            }),
            new webpack.DefinePlugin({
                CANVAS_RENDERER: JSON.stringify(true),
                WEBGL_RENDERER: JSON.stringify(true),
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "src/assets",
                        to: "assets",
                    },
                ],
            }),
        ],
    };
};
