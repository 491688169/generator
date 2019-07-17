import React from 'react';

const wontBind = [
    'constructor',
    'render',
    'componentWillMount',
    'componentDidMount',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount',
    'getSnapshotBeforeUpdate',
];

export default function autoBind(context) {
    const map = {};
    let proto = getPrototypeOf(context);

    while (proto && proto !== React.Component.prototype) {
        Object.getOwnPropertyNames(proto)
            .filter(method => wontBind.indexOf(method) < 0 && !(method in map))
            .forEach(method => {
                const desc = Object.getOwnPropertyDescriptor(proto, method);
                if (typeof desc.value !== 'function') {
                    return;
                }

                map[method] = true;
                bind(proto, method, desc);
            });
        proto = getPrototypeOf(proto);
    }
}

function bind(proto, method, desc) {
    const fn = desc.value;

    Object.defineProperty(proto, method, {
        configurable: true,
        get() {
            if (this === proto || Object.prototype.hasOwnProperty.call(this, method)) return fn;

            const boundFn = fn.bind(this);
            Object.defineProperty(this, method, {
                value: boundFn,
                configurable: true,
                writable: true,
            });
            return boundFn;
        },
    });
}

function getPrototypeOf(obj) {
    // eslint-disable-next-line no-proto
    return obj.__proto__ || Object.getPrototypeOf(obj);
}
