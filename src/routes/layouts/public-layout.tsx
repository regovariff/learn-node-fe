import { FC, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Layout from './layout';
import { PAGE_ROUTES } from '../../constant/page-routes';
import './public-layout.scss';

const PublicLayout: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousRouteRef = useRef<string | null>(null);

    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    useEffect(() => {
        previousRouteRef.current = location.pathname;
    }, [location.pathname]);

    useEffect(() => {
        const { PROTECTED, PUBLIC } = PAGE_ROUTES;
        const publicRoutes = [PUBLIC.HOME, PUBLIC.LOGIN, PUBLIC.REGISTER];

        if (isAuthenticated && publicRoutes.includes(location.pathname)) {
            const previousRoute = previousRouteRef.current;

            if (previousRoute && !publicRoutes.includes(previousRoute)) {
                navigate(previousRoute, { replace: true });
            } else {
                navigate(PROTECTED.PROFILE, { replace: true });
            }
        }
    }, [location.pathname, navigate, isAuthenticated]);

    return (
        <Layout>
            <div className="auth-layout-wrapper">
                <div className="outlet-wrapper">
                    <Outlet />
                </div>
            </div>
        </Layout>
    );
};

export default PublicLayout;
