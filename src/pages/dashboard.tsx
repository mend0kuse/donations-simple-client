import { CreateDonationForm } from '../components/create-donation-form/create-donation-form';
import { useConnectedUser } from '../contracts/hooks/use-connected-user';
import { Layout } from './layout';

export const DashboardPage = () => {
    const { isLoading, user } = useConnectedUser();

    const Content = () => {
        if (isLoading) {
            return <p>Loading ...</p>;
        }

        if (!user) {
            return <p>Failed</p>;
        }

        return (
            <div>
                <p>User role: {user?.role}</p>
                <CreateDonationForm />
            </div>
        );
    };

    return (
        <Layout>
            <Content />
        </Layout>
    );
};

//
