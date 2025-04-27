import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';

import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import ProfilePage from '../pages/profile';
import StatusPage from '../pages/status-page';
import { PAGE_ROUTES } from '../constant/page-routes';

const { PUBLIC, PROTECTED } = PAGE_ROUTES;

const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <Navigate to={PAGE_ROUTES.PUBLIC.LOGIN} replace /> },
            { path: PUBLIC.LOGIN, element: <LoginPage /> },
            { path: PUBLIC.REGISTER, element: <RegisterPage /> },
        ],
    },
    {
        path: '/',
        element: <ProtectedLayout />,
        children: [
            { path: PROTECTED.PROFILE, element: <ProfilePage /> },
            { path: PROTECTED.STATUS, element: <StatusPage /> },
        ],
    },
]);

export default router;
