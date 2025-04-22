import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PAGE_ROUTES } from '../../constant/page-routes';

const ProtectedLayout: FC = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to={PAGE_ROUTES.PUBLIC.LOGIN} state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedLayout;
