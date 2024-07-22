import { fromNano, toNano } from '@ton/core';
import { CHAIN, useTonConnectUI } from '@tonconnect/ui-react';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { tonClient } from '../../api/ton-client';
import { useAsyncInitialize } from '../../hooks/use-async-initialize';
import { Donation, DonationData, DonationDataPayload } from '../wrappers/donation';
import { useDonationManager } from './use-donation-manager';

export const useDonation = (index: number) => {
    const [tonConnectUI] = useTonConnectUI();

    const { getItemAddressByIndex } = useDonationManager();
    const [contractData, setContractData] = useState<DonationData | null>(null);

    const [contract] = useAsyncInitialize(async () => {
        const address = await getItemAddressByIndex(index);
        const contract = address ? Donation.createFromAddress(address) : null;

        if (!contract) {
            return null;
        }

        const result = tonClient.open(contract);
        const transactions = await tonClient.getTransactions(contract.address, {
            limit: 100, // TODO
        });

        const donators = transactions
            .filter((tx) => tx.inMessage?.body.beginParse().remainingBits === 0)
            .map(({ inMessage }) => {
                if (inMessage?.info.type !== 'internal') {
                    return;
                }

                return {
                    address: inMessage.info.src,
                    amount: Number(fromNano(inMessage.info.value.coins)),
                    createdAt: inMessage.info.createdAt,
                };
            })
            .filter(Boolean) as DonationData['donators'];

        setContractData({
            ...(await result.getData()),
            donators,
        });

        return result;
    }, [index]);

    const changeData = useCallback(
        async (payload: DonationDataPayload) => {
            if (!contract) {
                return;
            }

            try {
                const result = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: contract.address.toString(),
                            amount: toNano('0.05').toString(),
                            payload: contract.buildChangeData(payload).toBoc().toString('base64'),
                        },
                    ],
                    validUntil: dayjs().add(10, 'minutes').unix(),
                    network: CHAIN.TESTNET,
                });

                return result;
            } catch (error) {
                console.log(error);
            }
        },
        [contract, tonConnectUI],
    );

    const donate = useCallback(
        async (tonAmount: number) => {
            if (!contract) {
                return;
            }

            try {
                const result = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: contract.address.toString(),
                            amount: toNano(tonAmount).toString(),
                        },
                    ],
                    validUntil: dayjs().add(10, 'minutes').unix(),
                    network: CHAIN.TESTNET,
                });

                return result;
            } catch (error) {
                console.log(error);
            }
        },
        [contract, tonConnectUI],
    );

    return {
        donate,
        changeData,
        contractData,
    };
};
