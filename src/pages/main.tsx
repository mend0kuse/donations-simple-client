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

// add/remove admins
// enable/disable admins
// create donations
// change settings