import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecurlyProvider, Elements } from '@recurly/react-recurly';

import Layout from './Layout';
import Home from './Home';

import Plans from './pages/Plans';
import PlanOptions from './components/PlanOptions';
import Checkout from './pages/Checkout';
import Success from './pages/Success';

{/* Stylesheets */ }
import './style.css'


{/* React Router Config */ }
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                children: [
                    { index: true, element: <Home /> },
                    {
                        path: '/select-plan',
                        element: <Plans />,
                    },
                    {
                        path: '/select-options',
                        element: <PlanOptions />,
                    },
                    {
                        path: '/checkout',
                        element: <Checkout />,
                    },
                    {
                        path: '/success/:accountId',
                        element: <Success />,
                    }
                ]
            }
        ]
    }
])

export default function App() {
    return (

        <RecurlyProvider publicKey={`${publicKey}`} >
            <Elements>
                <RouterProvider router={router} />
            </Elements>
        </RecurlyProvider>

    );
}