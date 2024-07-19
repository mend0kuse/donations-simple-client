import { ReactNode } from 'react';
import { Header } from '../components/header/header';

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <Header />
            <div>{children}</div>
        </div>
    );
};
