import { fromNano } from '@ton/core';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ManageDonation } from '../components/manage-donation/manage-donation';
import { useDonation } from '../contracts/hooks/use-donation';
import { useDonationManager } from '../contracts/hooks/use-donation-manager';
import { Layout } from './layout';

export const DonationPage = () => {
    const { index } = useParams<{ index: string }>();
    const { contractData, changeData, donate: makeDonate } = useDonation(Number(index));
    const { enableDonation, disableDonation } = useDonationManager();
    const inputRef = useRef<HTMLInputElement>(null);

    if (!contractData) {
        return null;
    }

    async function onDisable() {
        await disableDonation(Number(index));
    }

    async function onEnable() {
        await enableDonation(Number(index));
    }

    async function onDonate() {
        if (!inputRef.current) {
            return;
        }

        await makeDonate(Number(inputRef.current.value));
    }

    const { donators, ...dataToPrint } = contractData;

    return (
        <Layout>
            <div>
                <ManageDonation
                    onDisable={onDisable}
                    onEnable={onEnable}
                    donation={contractData}
                    onChangeData={changeData}
                />
                <h2>Balance: {fromNano(contractData.balance)}</h2>
                <pre>{JSON.stringify(dataToPrint, null, 4)}</pre>
                <div>
                    <input type="number" ref={inputRef} />
                    <button onClick={onDonate}>Donate ton</button>
                </div>
                <div>
                    <h3>Donators:</h3>
                    {donators &&
                        donators?.map((donate, index) => {
                            return (
                                <div style={{ border: '1px solid black', padding: 20 }}>
                                    <p key={index}>{donate.address.toString({ testOnly: true })}</p>
                                    <p>{donate.amount} TON</p>
                                    <p>{new Date(donate.createdAt * 1000).toLocaleString()}</p>
                                </div>
                            );
                        })}
                </div>
            </div>
        </Layout>
    );
};
