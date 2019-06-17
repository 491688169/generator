import { Modal } from 'antd';

import routerConfig from '../configs/routerConfig';

import '$scripts/setup';

G.start({
    routes: routerConfig,
    basename: '/',
    api: {
        alert: errMsg => {
            Modal.error({ title: errMsg });
        },
    },
});
