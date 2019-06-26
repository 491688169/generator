import { Modal } from 'antd';

import routerConfig from '../configs/routerConfig';

import '$scripts/setup';
import model from '../models/index';

G.start({
    routes: routerConfig,
    basename: '/',
    model,
    api: {
        alert: errMsg => {
            Modal.error({ title: errMsg });
        },
    },
});
