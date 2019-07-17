import Loadable from 'react-loadable';

export default [
    {
        path: '/',
        exact: true,
        redirect: '/login',
    },{
        path: '/login',
        component: Loadable({
            loader: () => import('../pages/Login/index'),
            loading: () => 'loading...',
        }),
    }
];
