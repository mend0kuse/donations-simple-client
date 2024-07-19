import { TonConnectButton } from '@tonconnect/ui-react';
import './header.css';
import { NavLink } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="header">
            <nav className="nav">
                <NavLink to={`/dashboard`}>Dashboard</NavLink>
                <NavLink to={`/`}>Main</NavLink>
            </nav>

            <TonConnectButton />
        </header>
    );
};
