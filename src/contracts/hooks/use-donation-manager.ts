import { Address, Dictionary } from '@ton/core';
import { useAsyncInitialize } from '../../hooks/use-async-initialize';
import { useTonClient } from '../../hooks/use-ton-client';
import { DonationManager } from '../wrappers/donation-manager';
import { useCallback, useEffect, useState } from 'react';

export const useDonationManager = () => {
    const tonClient = useTonClient();
    const [contractData, setContractData] = useState<{
        owner: null | Address;
        admins: null | Dictionary<Address, Address>;
    }>({
        owner: null,
        admins: null,
    });

    const donationManger = useAsyncInitialize(async () => {
        return tonClient?.open(
            DonationManager.createFromAddress(
                Address.parse('kQB0lL0IhMnlEXqahCb9nL8L_yhSRuYufZuiWiWGn_jOFi_t'), // todo env
            ),
        );
    }, [tonClient]);

    useEffect(() => {
        (async () => {
            if (!donationManger) {
                return;
            }

            const owner = await donationManger.getOwner();
            const admins = await donationManger.getAdmins();

            setContractData({ owner, admins });
        })();
    }, [donationManger]);

    const checkManagerRights = useCallback(
        async (address: Address) => {
            if (!donationManger) {
                return Promise.resolve(false);
            }

            return (await donationManger.getManagerRights(address)).some(Boolean);
        },
        [donationManger],
    );

    return {
        ...contractData,
        checkManagerRights,
    };
};
