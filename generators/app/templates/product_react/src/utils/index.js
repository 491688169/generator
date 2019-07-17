// params: window.location
export const parseSearch = ({ search }) => {
    const searchObj = {};
    const queries = search.replace(/^\?/, '').split('&');
    queries.forEach(query => {
        const key = query.split('=')[0];
        const value = query.split('=')[1];
        if (value !== 'undefined') {
            searchObj[key] = value;
        }
    });

    return searchObj;
};

export const compactObject = originObject => {
    const result = {};
    Object.keys(originObject).forEach(key => {
        if (originObject[key]) {
            result[key] = originObject[key];
        }
    });

    return result;
};

export const toEnum = (origin, { keyText = 'key', valueText = 'value' } = {}) => {
    if (Array.isArray(origin)) {
        return origin.reduce((acc, i) => {
            acc[(acc[i[valueText]] = i[keyText])] = i[valueText];
            return acc;
        }, {});
    }
    if (Object.prototype.toString.call(origin) === '[object Object]') {
        return Object.keys(origin).reduce((acc, key) => {
            acc[(acc[origin[key]] = key)] = origin[key];
            return acc;
        }, {});
    }
    return null;
};

export function classNameCombine(_styleOrigin, styleCalling) {
    if (!_styleOrigin) return null;
    const styleOrigin = _styleOrigin;
    Object.keys(styleOrigin).forEach(s => {
        if (styleCalling[s]) {
            styleOrigin[s] = `${styleOrigin[s]} ${styleCalling[s]}`;
        }
    });
    return styleOrigin;
}
