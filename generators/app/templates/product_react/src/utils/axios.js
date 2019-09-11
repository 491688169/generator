import axios from 'axios';

import storage from './storage';

export default function fetchConf({
    alert = window.alert,
    base = '/__api',
    options = {},
    timeout = 20000,
}) {
    const configOpt = {
        timeout,
        withCredentials: false,
        responseType: '',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
    };
    const api = {};
    const defaultConf = { baseURL: base || __BACKEND__, ...configOpt };
    const defaultConfMock = { baseURL: '/mock', ...configOpt };
    const defaultConfRender = { baseURL: '/__render', ...configOpt };
    const conf = { ...defaultConf, ...options };
    const confRender = { ...defaultConfRender, ...options };
    const confMock = { ...defaultConfMock, ...options };

    function axiosConfig(config) {
        const configMod = config;
        const token = storage.get('token');

        if (token) {
            configMod.headers.Authorization = `Bearer ${token}`;
        }
        return configMod;
    }
    function axiosError(error) {
        alert(
            `【Axios.interceptors.request】error.data.error.message' ${error.data.error.message}`
        );
    }
    const Axios = axios.create(conf);
    const AxiosRender = axios.create(confRender);
    const AxiosMock = axios.create(confMock);

    Axios.interceptors.request.use(axiosConfig, axiosError);
    AxiosRender.interceptors.request.use(axiosConfig, axiosError);
    AxiosMock.interceptors.request.use(axiosConfig, axiosError);

    Object.keys(api).forEach(key => {
        if (__MOCK__ && api[key].mock) {
            api[key] = fetch.bind(null, api[key], AxiosMock);
        } else if (api[key].baseURL === '/__render') {
            api[key] = fetch.bind(null, api[key], AxiosRender);
        } else {
            api[key] = fetch.bind(null, api[key], Axios);
        }
    });

    /**
     * @author qianjin<qianjin@learnta.com>
     * @param {object} opts 这个参数是在api.js中的配置中指定
     * @param {object} axiosInstance axios的实例
     * @param {object} urlOptions 这个参数是在调用时指定
     * @description 大致有三种请求的情况：1. get请求的query: G.api.xxx({query}) 2. post请求的param: G.api.xxx({data}) 3. url里面有param的，在api.js中用{}包裹，在调用处使用G.api.xxx({urlParams})
     */
    function fetch(opts, axiosInstance, urlOptions) {
        const combineOpts = { ...opts, ...urlOptions };
        if (combineOpts.urlParams) {
            combineOpts.url = replaceParams(combineOpts.url, combineOpts.urlParams);
        }
        if (combineOpts.query) {
            combineOpts.params = combineOpts.query;
        }
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axiosInstance(combineOpts);
                const { code, data, message } = response.data;

                if (code === '0' && data) {
                    resolve(data);
                } else if (code && code !== '0') {
                    if (message) alert(message);
                    reject(response.data);
                } else {
                    resolve(response.data);
                }
            } catch (e) {
                // 这里已经针对接口的报错做了处理，一般来说不用在具体调用的地方catch，除非有特殊需求。
                // token过期，回到登录页面
                if (e.response.status === 401) {
                    storage.del('token');
                    G.gotoSignIn();
                } else {
                    alert('系统正在更新，请稍后尝试');
                }
                reject(e.response.data);
            }
        });
    }
    return api;
}

function replaceParams(url, urlParams) {
    const urlReplaceKeys = getMatchKeys(url, []);
    let urlMod = url;

    for (let i = 0; i < urlReplaceKeys.length; i += 1) {
        const key = urlReplaceKeys[i];

        urlMod = urlMod.replace(`{${key}}`, urlParams[key]);
    }

    return urlMod;
}

function getMatchKeys(url, matchKeys) {
    const reg = /\{(\w+)\}/g;
    let urlReplaceKeys = reg.exec(url);
    while (urlReplaceKeys) {
        matchKeys.push(urlReplaceKeys[1]);
        urlReplaceKeys = reg.exec(url);
    }

    return matchKeys;
}
