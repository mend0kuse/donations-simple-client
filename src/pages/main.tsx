import { DonationList } from '../components/donations-list/donations-list';
import { Layout } from './layout';

export const MainPage = () => {
    return (
        <Layout>
            <DonationList />
        </Layout>
    );
};

// TODO

// enable/disable contracts
// check pass hardcap contract behavior
// change settings