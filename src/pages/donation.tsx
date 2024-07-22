import { useParams } from 'react-router-dom';
import { useDonation } from '../contracts/hooks/use-donation';
import { Layout } from './layout';
import { ManageDonation } from '../components/manage-donation/manage-donation';
import { useDonationManager } from '../contracts/hooks/use-donation-manager';

export const DonationPage = () => {
    const { index } = useParams<{ index: string }>();
    const { contractData, changeData } = useDonation(Number(index));
    const { enableDonation, disableDonation } = useDonationManager();

    if (!contractData) {
        return null;
    }

    async function onDisable() {
        await disableDonation(Number(index));
    }

    async function onEnable() {
        await enableDonation(Number(index));
    }

    return (
        <Layout>
            <div>
                <ManageDonation
                    onDisable={onDisable}
                    onEnable={onEnable}
                    donation={contractData}
                    onChangeData={changeData}
                />
                <pre>{JSON.stringify(contractData, null, 4)}</pre>
            </div>
        </Layout>
    );
};
