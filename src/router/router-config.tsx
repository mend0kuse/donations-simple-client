import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/main';
import { DashboardPage } from '../pages/dashboard';
import { DonationPage } from '../pages/donation';

// todo

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/dashboard',
        element: <DashboardPage />,
    },
    {
        path: '/donation/:index',
        element: <DonationPage />,
    },
]);
