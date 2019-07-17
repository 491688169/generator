module.exports = {
    presets: [
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ],
        ['@babel/preset-react', { development: process.env.NODE_ENV === 'development' }],
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: 'css',
            },
        ],
    ],
};
