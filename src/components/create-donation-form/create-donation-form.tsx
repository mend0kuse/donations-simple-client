import dayjs from 'dayjs';
import { USER_ROLE, useConnectedUser } from '../../contracts/hooks/use-connected-user';
import { useDonationManager } from '../../contracts/hooks/use-donation-manager';
import { Address, toNano } from '@ton/core';

export const CreateDonationForm = () => {
    const { user } = useConnectedUser();
    const { createDonation } = useDonationManager();

    if (!user || user.role === USER_ROLE.USER) {
        return null;
    }

    const onSend = () => {
        createDonation({
            deadline: BigInt(dayjs().add(30, 'days').unix()),
            destination: Address.parse(user.address),
            hardcap: toNano(100),
        });
    };

    return (
        <div>
            <h2>Create donation</h2>
            <form>
                <button onClick={onSend}>Send</button>
            </form>
        </div>
    );
};
