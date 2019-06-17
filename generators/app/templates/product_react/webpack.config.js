const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HashOutput = require('webpack-plugin-hash-output');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const autoprefixer = require('autoprefixer');
const uploadrc = require('rc')('upload');

const { HandleTemplate } = require('./buildTools/index');

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const env = require('./env');

const proxyRender = {
    changeOrigin: true,
    secure: false,
    target: 'https://t1.learnta.cn/__api', // 随便写，但必须有
    router(req) {
        console.log(`proxy: ${env.BACKEND}${req.url}`);
        return `${env.BACKEND}${req.url}`;
    },
    pathRewrite() {
        return '';
    },
};
const dllManifest = env.DEV
    ? require('./src/static/dll/manifest.dll.dev.json')
    : require('./src/static/dll/manifest.dll.prod.json');

const cdnUrl = uploadrc.url;
const rootDir = path.resolve(__dirname);
const distDir = path.join(rootDir, 'dist');
const srcDir = path.join(rootDir, 'src');
const staticDir = path.join(srcDir, 'static');
const productDir = path.join(srcDir, 'pages');
const productEntry = path.join(productDir, 'index.js');

const envVariables = Object.keys(env).reduce((res, k) => {
    res[`__${k}__`] = JSON.stringify(env[k]);
    return res;
}, {});

const wp = {
    mode: env.DEV ? 'development' : 'production',
    entry: env.DEV
        ? [
              `webpack-dev-server/client?${env.FRONTEND}`, // 资源服务器地址
              'webpack/hot/only-dev-server',
              productEntry,
          ]
        : ['@babel/polyfill', productEntry],
    output: {
        filename: env.DEV ? '[name].js' : '[name]-[chunkhash:8].js',
        publicPath: env.DEV ? env.FRONTEND : `${cdnUrl}/staSrc/${env.PRODUCT}/${env.TARGET}/`,
        path: distDir,
        chunkFilename: '[name].[chunkhash:8].js',
    },
    devtool: env.DEV && 'source-map',
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            $assets: path.join(srcDir, 'assets'),
            $components: path.join(srcDir, 'components'),
            $utils: path.join(srcDir, 'utils'),
            $scripts: path.join(srcDir, 'scripts'),
            $configs: path.join(srcDir, 'configs'),
            $models: path.join(srcDir, 'models'),
        },
    },
    cache: env.DEV,
    // 不打包以下库，通过dll处理
    // key是全局变量名，value是引用的库名
    externals: {
        React: 'react',
        ReactDOM: 'react-dom',
        ReactRedux: 'react-redux',
        PropTypes: 'prop-types',
        ReactRouterDOM: 'react-router-dom',
        Antd: 'antd',
        Jquery: 'jquery',
        Mirrorx: 'mirrorx',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    // node_modules内的依赖库
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    minChunks: 1, // 被不同entry引用次数(import),1次的话没必要提取
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100,
                },
                common: {
                    // ‘src/js’ 下的js文件
                    chunks: 'all',
                    test: /[\\/]src[\\/]/, // 也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,
                    name: 'common', // 生成文件名，依据output规则
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 1,
                },
            },
        },
        runtimeChunk: {
            name: 'manifest',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                enforce: 'pre',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['happypack/loader?id=js'],
            },
            {
                test: /\.css$/,
                use: [env.DEV ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                    env.DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[name]-[local]-[hash:base64:6]',
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
                            plugins: () => [
                                autoprefixer({
                                    browsers: ['last 10 version', 'ie >= 10'],
                                }),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    publicPath: env.DEV
                        ? env.FRONTEND
                        : `${cdnUrl}/staSrc/${env.PRODUCT}/${env.TARGET}/`,
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|mp4)$/,
                loader: 'file-loader',
            },
            {
                test: /\.ejs$/,
                loader: 'compile-ejs-loader',
                options: {
                    beautify: true,
                },
            },
        ],
    },
    plugins: [
        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'js',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: env.DEV,
                    },
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
            // 使用共享进程池中的子进程去处理任务
            threadPool: happyThreadPool,
            // ... 其它配置项
        }),
        // Since webpack v4 the extract-text-webpack-plugin should not be used for css. Use mini-css-extract-plugin instead.
        new MiniCssExtractPlugin({
            filename: env.DEV ? '[name].css' : '[name].[hash].css',
            chunkFilename: env.DEV ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(productDir, 'index.ejs'),
            inject: true,
            hash: !env.DEV,
            ...envVariables,
        }),
        env.DEV ? () => {} : new HandleTemplate(),
        // 定义全局变量React指向react库就不用每次import react
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            React: 'react',
            ReactDOM: 'react-dom',
        }),
        new webpack.DefinePlugin(envVariables),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: dllManifest,
        }),
        // css变化时不会影响js的hash，参看hash,chunkhash,contenthash的区别
        // new WebpackMd5Hash(),
        new HashOutput(),
        new ManifestPlugin(),
        new CopyWebpackPlugin([
            {
                from: 'src/static/dll.vendor.*.prod.*',
                to: '',
                flatten: true,
            },
        ]),
        new CleanWebpackPlugin(),
        new AddAssetHtmlPlugin(
            env.DEV
                ? {
                      filepath: path.join(staticDir, 'dll', 'dll.vendor.*.dev.js'),
                  }
                : {
                      filepath: path.join(staticDir, 'dll', 'dll.vendor.*.prod.js'),
                  }
        ),
        // env.DEV && env.HTTPS ? () => {} : new OfflinePlugin(),
    ],
    devServer: {
        // publicPath: 'http://127.0.0.1:8000/', // bundle.js来源
        contentBase: srcDir, // 静态文件来源
        compress: true,
        historyApiFallback: true,
        host: env.HOST,
        port: env.PORT, // 不要用8080，被webStorm占用
        hot: env.HOT, // hot module replacement 代码变化时只改变变动的部分
        inline: env.INLINE,
        https: env.HTTPS,
        clientLogLevel: 'none',
        open: true,
        stats: { color: true },
        overlay: true, // 报错时会在浏览器全屏弹出
        headers: {
            'Service-Worker-Allowed': '/',
        },
        proxy: {
            '/__api/*': {
                changeOrigin: true,
                secure: false,
                target: 'https://t1.learnta.cn/__api', // 随便写，但必须有
                router(req) {
                    let url = req.originalUrl;
                    const rePrefix = /^\/__api\/(\w+)?/;
                    let opt = {};
                    let flag = '';
                    if (rePrefix.test(url)) {
                        flag = RegExp.$1;
                        opt = proxySwitch(flag);
                    }
                    url = url.replace(`/${flag}`, opt.base);
                    if (!opt.target) opt.target = `${env.BACKEND}`;
                    console.log(`http proxy: ${opt.target}${url}`);
                    return opt.target + url;
                },
                pathRewrite() {
                    return '';
                },
            },
            '/mock/*': {
                changeOrigin: true,
                secure: false,
                target: 'https://t1.learnta.cn/__api', // 随便写，但必须有
                router(req) {
                    let url = req.originalUrl;
                    const rePrefixMock = /^\/mock\/(.*?)\//;
                    let opt = {};
                    if (rePrefixMock.test(url)) {
                        const flag = RegExp.$1;
                        opt = proxySwitch(flag);
                        url = url.replace('/mock', `/mock${opt.mock}`);
                        if (!opt.target) opt.target = 'https://yapi.learnta.cn';
                        return opt.target + url;
                    }
                    url = url.replace(`/${RegExp.$1}`, opt.base);
                    if (!opt.target) opt.target = `${env.BACKEND}`;
                    console.log(`http proxy: ${opt.target}${url}`);
                    return opt.target + url;
                },
                pathRewrite() {
                    return '';
                },
            },
            '/__render/*': proxyRender,
        },
    },
};

function proxySwitch(flag) {
    let base;
    let target;
    let mock;
    switch (flag) {
        case '':
            base = '/';
            mock = '/';
            break;
        case 'fo':
            base = '/fo/rest';
            mock = '/24';
            break;
        case 'admin':
            base = '/admin';
            mock = '/28';
            break; // 后台
        case 'tarzan':
            base = '/tarzan';
            mock = '/32';
            break; // 论答课堂
        case 'busi_admin':
            base = '/busi_admin';
            mock = '/40';
            break; // 销课后台
        case 'beatV2':
            base = '/beatV2';
            mock = '/48';
            break; // 任务卡2.0
        case 'beatV3':
            base = '/beatV3';
            mock = '/57';
            break; // 任务卡2.0
        case 'auth':
            base = '/auth';
            mock = '/11';
            break; // 权限系统
        case 'fudao':
            base = '/fudao';
            mock = '/61';
            break; // 论答辅导
        case 'wechat':
            base = '/wechat';
            mock = '/';
            break; // 微信相关接口
        case 'bd':
            base = '/bd';
            mock = '/20';
            break; // 2B相关接口
        case 'officialsite':
            base = '/officialsite';
            mock = '/63';
            break; // 论答管网
        case 'manage':
            base = '/manage';
            mock = '/64';
            break; // 测试本地接口
        case 'library':
            base = '/library';
            mock = '/65';
            break; // 课程审核
        case 'operation':
            base = '/operation';
            mock = '/73';
            break; // operationAdmin
        case 'activity':
            base = '/activity';
            mock = '/74';
            break;
        case 'material':
            base = '/material';
            mock = '/130';
            break;
        default:
            base = '/';
            mock = '/';
    }
    return { base, target, mock };
}

if (!env.DEV) {
    wp.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
        })
    );
} else if (env.DEV && env.HOT) {
    wp.plugins.push(
        new webpack.HotModuleReplacementPlugin() // 启用 HMR
    );
}

module.exports = wp;
