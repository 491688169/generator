const pkgInfo = require('./package.json');

const version = pkgInfo.version;

const env = getEnv('ENV', 'dev');
const dev = /dev/i.test(env);
const hot = getEnv('HOT', dev);
const host = getEnv('HOST', 'localhost');
const debug = getEnv('DEBUG', false);
const backendHost = getEnv('BACKEND_HOST');
const target = backendHost === 'undefined' ? getEnv('TARGET', 't1') : null;
const port = getEnv('PORT', 8010);
const https = getEnv('HTTPS', true);
const mock = getEnv('MOCK', false);

const targetBackendMap = {
    t1: 'https://t1.learnta.cn',
    t2: 'https://t2.learnta.cn',
    t3: 'https://t3.learnta.cn',
    sit: 'https://sit.learnta.cn',
    staging: 'https://learnta.cn',
    prod: 'https://learnta.cn',
};

const backend =
    backendHost === 'undefined' ? targetBackendMap[target] || targetBackendMap.t1 : backendHost;

const conf = {
    VERSION: version, // string,版本号，与 package.json 的 version 保持一致
    PROTOCOL: https ? 'https' : 'http', // string,网络协议类型,默认是https
    HOST: host, // string,本地开发域名,默认localhost
    PORT: port, // number,本地开发服务端口号,默认是8010
    ENV: env, // string,打包环境模式开发环境（dev）还是生产环境(prod),默认是dev
    TARGET: target, // string,打包后的运行环境 t1,t2,t3 默认t1
    BACKEND: backend, // string,后台接口所在的服务器的域名或ip地址,默认是t1.learnta.cn
    HTTPS: https, // boolean,是否开启https,默认是true
    DEV: dev, // boolean,是否是开发环境,默认是true
    HOT: hot, // boolean,是否开启HMR，默认是true
    DEBUG: debug, // boolean,是否开启debug模式,默认是false
    MOCK: mock, // boolean,是否使用mock,默认是false
};

conf.FRONTEND = `${conf.PROTOCOL}://${conf.HOST}:${conf.PORT}/`;

outputConf(conf);

module.exports = conf;

function getEnv(key, defaultValue) {
    const result = process.env[key.toUpperCase()] || process.env[key.toLowerCase()] || defaultValue;
    return result === 'false' || result === 'true' ? JSON.parse(result) : result;
}

function outputConf(config) {
    const KEYS = Object.keys(config);
    const MAX_LENGTH = Math.max(...KEYS.map(k => k.length)) + 2;
    /* eslint-disable no-console */
    console.log('\r\n\x1b[36m==================== 环境变量 ======================\x1b[0m');
    Object.keys(config).forEach(k => {
        const color = config[k] === true ? '\x1b[35m' : '';
        const len = k.length;
        const prefix = len < MAX_LENGTH ? ' '.repeat(MAX_LENGTH - k.length) : '';
        console.log('%s%s: %j\x1b[0m', color, prefix + k, config[k]);
    });
    console.log('\x1b[36m===================================================\x1b[0m\r\n');
    /* eslint-disable no-console */
}
