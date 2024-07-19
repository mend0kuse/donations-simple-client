import { Donation, DonationConfig, DonationData } from '../wrappers/donation';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useAsyncInitialize } from '../../hooks/use-async-initialize';
import { useDonationManager } from './use-donation-manager';
import { tonClient } from '../../api/ton-client';
import { useState } from 'react';

export const useDonation = (index: number) => {
    const [tonConnectUI] = useTonConnectUI();

    const { getItemAddressByIndex } = useDonationManager();
    const [contractData, setContractData] = useState<DonationData | null>(null);

    // const [contractData, setContractData] = useAsyncInitialize(getContractState);

    const [contract] = useAsyncInitialize(async () => {
        const address = await getItemAddressByIndex(index);
        const contract = address ? Donation.createFromAddress(address) : null;

        if (!contract) {
            return null;
        }

        const result = tonClient.open(contract);
        setContractData(await result.getData());

        return result;
    }, [index]);

    return {
        contractData,
    };
};
