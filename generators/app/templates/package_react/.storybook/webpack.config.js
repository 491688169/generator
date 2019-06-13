const webpack = require('webpack');

module.exports = ({ config }) => {
    config.module.rules = config.module.rules.concat(
        {
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: require.resolve('babel-loader'),
                    options: {
                        presets: [['react-app', { flow: false, typescript: true }]],
                    },
                },
                // {
                //     loader: require.resolve('awesome-typescript-loader'),
                // },
                // Optional
                {
                    loader: require.resolve('react-docgen-typescript-loader'),
                },
            ],
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
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
        }
    );
    config.resolve.extensions.push('.ts', '.tsx');
    config.plugins.push(
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        })
    );
    config.externals = {
        ...config.externals,
        jsdom: 'window',
        cheerio: 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': 'window',
        'react/addons': true,
    };
    return config;
};
