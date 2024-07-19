import { Address } from '@ton/core';
import { useTonAddress } from '@tonconnect/ui-react';
import { useAsyncInitialize as useAsyncInitialize } from '../../hooks/use-async-initialize';
import { useDonationManager } from './use-donation-manager';
import { useState } from 'react';

// todo context mb

export const USER_ROLE = {
    ADMIN: 'admin',
    USER: 'user',
    OWNER: 'owner',
} as const;

// todo share

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// todo api wrapper

export const useConnectedUser = () => {
    const [isLoading, setIsLoading] = useState(false);

    const address = useTonAddress();
    const rawAddress = useTonAddress(false);
    const { getRoleByAddress } = useDonationManager();

    const [user] = useAsyncInitialize(async () => {
        if (!address) {
            return null;
        }

        try {
            setIsLoading(true);

            const role = await getRoleByAddress(Address.parse(address));
            return { role, address, rawAddress };
        } catch (error) {
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    return { user, isLoading };
};
