import { Address } from '@ton/core';
import { useCallback, useRef } from 'react';
import { Header } from './components/header';
import { useDonationManager } from './contracts/hooks/use-donation-manager';
import { checkIsValidAddress } from './helpers/check-is-valid-address';

export function App() {
    const checkedRef = useRef<HTMLInputElement>(null);
    const { checkManagerRights } = useDonationManager();

    const onCheckRights = useCallback(async () => {
        const value = checkedRef.current?.value;

        if (!value) {
            alert('Fill input');
            return;
        }

        if (!checkIsValidAddress(value)) {
            alert('InvalidAddress');
            return;
        }

        const hasRights = await checkManagerRights(Address.parse(value));
        alert(hasRights ? 'Can manage' : 'FOrbidden');
    }, [checkManagerRights]);

    return (
        <div className="app">
            <Header />
            <input ref={checkedRef} />
            <button onClick={onCheckRights}>Check rights</button>
        </div>
    );
}
