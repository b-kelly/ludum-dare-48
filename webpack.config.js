const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = (_, argv) => {
    var isProd = argv.mode === "production";
    return {
        entry: {
            index: "./src/index.ts",
            join: "./src/join.ts",
        },
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
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
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
            new MiniCssExtractPlugin(),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                chunks: ["index"],
            }),
            new HtmlWebpackPlugin({
                filename: "join.html",
                template: "./src/join.html",
                chunks: ["join"],
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
