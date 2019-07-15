const path = require('path');
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
                // Optional
                {
                    loader: require.resolve('react-docgen-typescript-loader'),
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
                        modules: {
                            localIdentName: '[name]-[local]-[hash:base64:6]',
                        },
                        sourceMap: true,
                    },
                },
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
    config.resolve.alias = {
        ...config.resolve.alias,
        $src: path.join(__dirname, '../src'),
    };
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
