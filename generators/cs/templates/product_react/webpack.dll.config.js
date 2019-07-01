const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const rootDir = path.resolve(__dirname);
const dllDir = path.resolve(rootDir, 'src', 'static', 'dll');

const isDEV = process.env.NODE_ENV === 'dev';

const pathToClean = isDEV ? ['src/static/dll/*dll*.dev.*'] : ['src/static/dll/*dll*.prod.*'];
const libraryName = isDEV ? 'dll_[name]_[chunkhash]_dev' : 'dll_[name]_[chunkhash]_prod';
const fileName = isDEV ? 'dll.[name].[chunkhash].dev.js' : 'dll.[name].[chunkhash].prod.js';
const manifestName = isDEV ? 'manifest.dll.dev.json' : 'manifest.dll.prod.json';

module.exports = {
    mode: 'production',
    entry: {
        vendor: ['react', 'react-dom', 'mirrorx', 'react-router-dom', 'jquery', 'prop-types'],
    },
    output: {
        path: dllDir,
        filename: fileName,
        library: libraryName,
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(dllDir, manifestName),
            name: libraryName,
            context: __dirname,
        }),
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: pathToClean }),
    ],
};
