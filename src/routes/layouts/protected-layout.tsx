import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PAGE_ROUTES } from '../../constant/page-routes';
import Layout from './layout';
import './public-layout.scss';

const ProtectedLayout: FC = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to={PAGE_ROUTES.PUBLIC.LOGIN} state={{ from: location }} replace />;
    }

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

export default ProtectedLayout;
