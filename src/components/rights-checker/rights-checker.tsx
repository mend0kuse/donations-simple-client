import { Address } from '@ton/core';
import { useRef, useCallback } from 'react';
import { useDonationManager } from '../../contracts/hooks/use-donation-manager';
import { checkIsValidAddress } from '../../helpers/check-is-valid-address';
import { USER_ROLE } from '../../contracts/hooks/use-connected-user';

export const RightsChecker = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { getRoleByAddress } = useDonationManager();

    const onCheckRights = useCallback(async () => {
        const stringAddress = inputRef.current?.value;

        if (!stringAddress) {
            alert('Fill input');
            return;
        }

        if (!checkIsValidAddress(stringAddress)) {
            alert('Invalid Address');
            return;
        }

        const role = await getRoleByAddress(Address.parse(stringAddress));
        alert(role !== USER_ROLE.USER ? 'Can manage' : 'Forbidden');
    }, [getRoleByAddress]);

    return (
        <div>
            <h2>Check manage rights:</h2>
            <input ref={inputRef} />
            <button onClick={onCheckRights}>Check</button>
        </div>
    );
};
