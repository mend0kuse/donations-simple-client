import { Address, toNano } from '@ton/core';
import { CHAIN, useTonConnectUI } from '@tonconnect/ui-react';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { tonClient } from '../../api/ton-client';
import { useAsyncInitialize } from '../../hooks/use-async-initialize';
import { DonationManager } from '../wrappers/donation-manager';
import { USER_ROLE } from './use-connected-user';

// Move to api

const donationManagerContract = tonClient.open(
    DonationManager.createFromAddress(
        Address.parse('kQCV30IEKQZUqEWjkTcTboP-rKI3s3aiZsvk0XSCkaKqU7P8'), // todo env
    ),
);

const getContractState = async () => {
    const { owner, admins, index } = await donationManagerContract.getData();
    return { owner, admins, nextItemIndex: Number(index) ?? 1 };
};

const getItemAddressByIndex = async (index: number) => {
    return donationManagerContract.getDonationByIndex(BigInt(index));
};

const getRoleByAddress = async (address: Address) => {
    const [isOwner, isAdmin] = await donationManagerContract.getManagerRights(address);

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
                            address: donationManagerContract.address.toString(),
                            amount: toNano('0.05').toString(),
                            payload: donationManagerContract
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

    const enableDonation = useCallback(
        async (index: number) => {
            try {
                const result = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: donationManagerContract.address.toString(),
                            amount: toNano('0.05').toString(),
                            payload: donationManagerContract
                                .buildEnableBody(index)
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

    const disableDonation = useCallback(
        async (index: number) => {
            try {
                const result = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: donationManagerContract.address.toString(),
                            amount: toNano('0.05').toString(),
                            payload: donationManagerContract
                                .buildDisableBody(index)
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
                            address: donationManagerContract.address.toString(),
                            amount: toNano('0.05').toString(),
                            payload: donationManagerContract
                                .buildRemoveAdminsBody(admins)
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

    const addAdmins = useCallback(
        async ({ admins }: { admins: Address[] }) => {
            try {
                const result = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: donationManagerContract.address.toString(),
                            amount: toNano('0.05').toString(),
                            payload: donationManagerContract
                                .buildAddAdminsBody(admins)
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

    return {
        ...contractData,
        enableDonation,
        disableDonation,
        getRoleByAddress,
        removeAdmins,
        addAdmins,
        getItemAddressByIndex,
        createDonation,
        refetchContractData: refetchContractState,
    };
};
