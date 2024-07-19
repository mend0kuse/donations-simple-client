import { TonConnectUIProvider } from '@tonconnect/ui-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router-config';

// todo env manifest
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TonConnectUIProvider manifestUrl="https://gist.githubusercontent.com/mend0kuse/5ce6ba77b85a19733e71de7b6fcfbe03/raw/952b7db6e43907d814cf92f6091831144292b530/manifest.json">
            <RouterProvider router={router} />
        </TonConnectUIProvider>
    </React.StrictMode>,
);