import { useDonationManager } from '../../contracts/hooks/use-donation-manager';
import { DonationItem } from '../donation-item/donation-item';

export const DonationList = () => {
    const { nextItemIndex } = useDonationManager();
    const currentItemsCount = (nextItemIndex ?? 1) - 1;

    if (currentItemsCount === 0) {
        return <p>No donations yet</p>;
    }

    return (
        <div>
            {Array.from({ length: currentItemsCount }, (_, index) => (
                <DonationItem key={index} index={index + 1} />
            ))}
        </div>
    );
};
