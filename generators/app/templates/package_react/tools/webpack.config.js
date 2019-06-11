const path = require('path');

const srcPath = path.join(__dirname, '..', 'src');
const enrtyPath = path.join(srcPath, 'index.ts');
const distPath = path.join(__dirname, '..', 'dist');

module.exports = {
    mode: 'production',
    entry: ['@babel/polyfill', enrtyPath],
    output: {
        path: distPath,
        filename: 'learnta-taskcard.min.js',
        library: 'taskcard',
        libraryTarget: 'umd',
    },
    externals: {
        React: 'react',
        ReactDOM: 'react-dom',
        PropTypes: 'prop-types',
        Antd: 'antd',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: require.resolve('awesome-typescript-loader'),
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            fix: true,
                            enforce: 'pre',
                            configFile: '.eslintrc.json',
                            emitWarning: true,
                        },
                    },
                ],
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[name]-[local]-[hash:base64:6]',
                        },
                    },
                    // {
                    //     loader: 'typings-for-css-modules-loader',
                    //     options: {
                    //         modules: true,
                    //         namedExport: true,
                    //         camelCase: true,
                    //         minimize: true,
                    //         localIdentName: '[local]_[hash:base64:5]',
                    //     },
                    // },
                    {
                        loader: 'sass-loader',
                        options: { importLoaders: 1 },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            ident: 'postcss',
                            parser: 'postcss-scss',
                            plugins: () => [require('autoprefixer')()],
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|mp4)$/,
                loader: 'file-loader',
            },
        ],
    },
};
