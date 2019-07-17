import { Switch, Route, Redirect } from 'mirrorx';

function withRoutes(route) {
    const { Routes } = route;
    let len = Routes.length - 1;
    let Component = args => {
        const { render, ...props } = args;
        return render(props);
    };
    while (len >= 0) {
        const AuthRoute = Routes[len];
        const OldComponent = Component;
        Component = props => (
            <AuthRoute {...props}>
                <OldComponent {...props} />
            </AuthRoute>
        );
        len -= 1;
    }

    return args => {
        const { render, ...rest } = args;
        return (
            <Route
                {...rest}
                render={props => <Component {...props} route={route} render={render} />}
            />
        );
    };
}

export default function renderRoutes(routes, extraProps = {}, switchProps = {}) {
    return routes ? (
        <Switch {...switchProps}>
            {routes.map((route, i) => {
                if (route.redirect) {
                    return (
                        <Redirect
                            key={route.key || i}
                            from={route.path}
                            to={route.redirect}
                            exact={route.exact}
                            strict={route.strict}
                        />
                    );
                }
                const RouteRoute = route.Routes ? withRoutes(route) : Route;
                return (
                    <RouteRoute
                        key={route.key || i}
                        path={route.path}
                        exact={route.exact}
                        strict={route.strict}
                        render={props => {
                            const childRoutes = renderRoutes(
                                route.routes,
                                {},
                                {
                                    location: props.location,
                                }
                            );
                            if (route.component) {
                                const compatProps = {};
                                return (
                                    <route.component
                                        {...props}
                                        {...extraProps}
                                        {...compatProps}
                                        route={route}
                                    >
                                        {childRoutes}
                                    </route.component>
                                );
                            }

                            return childRoutes;
                        }}
                    />
                );
            })}
        </Switch>
    ) : null;
}
