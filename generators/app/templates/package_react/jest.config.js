module.exports = {
    collectCoverageFrom: ['stories/*.tsx'],
    transform: {
        '.(ts|tsx)$': 'ts-jest',
        '^.+\\.(jsx?|scss$)': 'babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/lib/'],
    testRegex: '(/test/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/.jest/register-context.js'],
};
