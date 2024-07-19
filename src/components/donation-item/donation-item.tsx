import { Link } from 'react-router-dom';
import { useDonation } from '../../contracts/hooks/use-donation';
import './donation-item.css';

export const DonationItem = ({ index }: { index: number }) => {
    const { contractData } = useDonation(index);

    if (!contractData) {
        return null;
    }

    return (
        <Link className="donation-item" to={`/donation/${index}`}>
            <pre>{JSON.stringify(contractData, null, 4)}</pre>
        </Link>
    );
};
