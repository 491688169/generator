import mirror, { Router, render } from 'mirrorx';

import axios from '$utils/axios';
import storage from '$utils/storage';
import renderRoutes from '$utils/render-routes';

export default function start({ api = {}, hashHistory = false, model = {}, routes, basename }) {
    const historyMode = hashHistory ? 'hash' : 'browser';

    mirror.defaults({
        historyMode,
    });

    const modelCombined = { ...model };
    Object.keys(modelCombined).forEach(m => {
        mirror.model(modelCombined[m]);
    });

    G.api = axios(api);
    G.history = historyMode;

    render(
        <Router basename={basename}>{renderRoutes(routes)}</Router>,
        document.getElementById('root')
    );
}

function gotoSignIn() {
    storage.del('token');
    // window.location.replace(`/${__PRODUCT__}/signin`);
}

function setUser({ token, loginName, displayName, expiresIn }) {
    storage.set('token', token, expiresIn);
    storage.set('loginName', loginName);
    storage.set('displayName', displayName || loginName);
}

const G = {
    gotoSignIn,
    start,
    setUser,
    storage,
};

window.G = G;
