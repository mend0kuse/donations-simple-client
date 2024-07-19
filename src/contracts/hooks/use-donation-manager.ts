import { Address, Dictionary, toNano } from '@ton/core';
import { CHAIN, useTonConnectUI } from '@tonconnect/ui-react';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { tonClient } from '../../api/ton-client';
import { useAsyncInitialize } from '../../hooks/use-async-initialize';
import { DonationManager } from '../wrappers/donation-manager';
import { USER_ROLE } from './use-connected-user';

// Move to api

const donationMangerContract = tonClient.open(
    DonationManager.createFromAddress(
        Address.parse('kQBesKcxhxfrl0Q6ZEG4xLxqihX1iAqt_rVPX_W5z1055LKi'), // todo env
    ),
);

const getContractState = async () => {
    const { owner, admins, index } = await donationMangerContract.getData();
    return { owner, admins, nextItemIndex: Number(index) ?? 1 };
};

const getItemAddressByIndex = async (index: number) => {
    return donationMangerContract.getDonationByIndex(BigInt(index));
};

const getRoleByAddress = async (address: Address) => {
    const [isOwner, isAdmin] = await donationMangerContract.getManagerRights(address);

    const role = (() => {
        if (isOwner) {
            return USER_ROLE.OWNER;
        }

        if (isAdmin) {
            return USER_ROLE.ADMIN;
        }

        return USER_ROLE.USER;
    })();

    return role;
};

export const useDonationManager = () => {
    const [tonConnectUI] = useTonConnectUI();
    const [contractData, setContractData] = useAsyncInitialize(getContractState);

    const refetchContractState = useCallback(async () => {
        setContractData(await getContractState());
    }, [setContractData]);

    const createDonation = useCallback(
        async ({
            deadline,
            destination,
            hardcap,
        }: {
            deadline: bigint;
            destination: Address;
            hardcap: bigint;
        }) => {
            try {
                const result = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: donationMangerContract.address.toString(),
                            amount: toNano('0.05').toString(),
                            payload: donationMangerContract
                                .buildCreateDonationBody({ deadline, destination, hardcap })
                                .toBoc()
                                .toString('base64'),
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
        [tonConnectUI],
    );

    const removeAdmins = useCallback(
        async ({ admins }: { admins: Address[] }) => {
            try {
                const result = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: donationMangerContract.address.toString(),
                            amount: toNano('0.05').toString(),
                            payload: donationMangerContract
                                .buildRemoveAdminsBody(admins)
                                .toBoc()
                                .toString('base64'),
                        },
                    ],
                    validUntil: dayjs().add(10, 'minutes').unix(),
                    network: CHAIN.TESTNET,
                });

                console.log(result);
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        [tonConnectUI],
    );

    const addAdmins = useCallback(
        async ({ admins }: { admins: Address[] }) => {
            try {
                const result = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: donationMangerContract.address.toString(),
                            amount: toNano('0.05').toString(),
                            payload: donationMangerContract
                                .buildAddAdminsBody(admins)
                                .toBoc()
                                .toString('base64'),
                        },
                    ],
                    validUntil: dayjs().add(10, 'minutes').unix(),
                    network: CHAIN.TESTNET,
                });

                console.log(result);
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        [tonConnectUI],
    );

    return {
        ...contractData,
        getRoleByAddress,
        removeAdmins,
        addAdmins,
        getItemAddressByIndex,
        createDonation,
        refetchContractData: refetchContractState,
    };
};
