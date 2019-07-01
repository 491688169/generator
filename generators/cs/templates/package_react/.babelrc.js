module.exports = {
    presets: [
        [
            '@babel/env',
            {
                targets: ['last 2 versions', 'ie >= 9'],
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ],
        ['@babel/preset-react'],
    ],
    env: {
        test: {
            plugins: ['require-context-hook'],
        },
    },
};
