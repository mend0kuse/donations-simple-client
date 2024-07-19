import { useParams } from 'react-router-dom';
import { useDonation } from '../contracts/hooks/use-donation';
import { Layout } from './layout';
import { ManageDonation } from '../components/manage-donation/manage-donation';

export const DonationPage = () => {
    const { index } = useParams<{ index: string }>();
    const { contractData, changeData } = useDonation(Number(index));

    if (!contractData) {
        return null;
    }

    return (
        <Layout>
            <div>
                <ManageDonation donation={contractData} onChangeData={changeData} />
                <pre>{JSON.stringify(contractData, null, 4)}</pre>
            </div>
        </Layout>
    );
};
