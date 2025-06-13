const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './src/renderer/index.tsx',
    target: 'web',
    devtool: isDevelopment ? 'source-map' : false,
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@renderer': path.resolve(__dirname, 'src/renderer'),
        '@shared': path.resolve(__dirname, 'src/shared'),
      },
      fallback: {
        path: false,
        fs: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        events: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, 'dist/renderer'),
      filename: 'bundle.js',
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/renderer/index.html',
        filename: 'index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    devServer: {
      port: 3000,
      hot: true,
      // Remove static directory to prevent conflicts with webpack-generated content
      // static: {
      //   directory: path.join(__dirname, 'dist/renderer'),
      // },
    },
  };
};
