import { ChangeEventHandler, useState } from 'react';
import { USER_ROLE, useConnectedUser } from '../../contracts/hooks/use-connected-user';
import { DonationData, DonationDataPayload } from '../../contracts/wrappers/donation';
import './manage-donation.css';

export const ManageDonation = ({
    donation: {
        balance,
        deadline,
        destination,
        hardcap,
        index,
        isActive,
        managerAddress,
        wasInited,
    },
    onChangeData,
}: {
    donation: DonationData;
    onChangeData: (data: DonationDataPayload) => void;
}) => {
    const { user, isLoading } = useConnectedUser();
    const [isChangeFormOpen, setIsChangeFormOpen] = useState(false);
    const [newData, setNewData] = useState<DonationDataPayload>({
        deadline,
        destination,
        hardcap,
    });

    if (isLoading) {
        return <p>Loading ...</p>;
    }

    const isOwner = destination.toString() === user?.address;
    if (!user || (!isOwner && user.role === USER_ROLE.USER)) {
        return null;
    }

    const onChangeField: ChangeEventHandler<HTMLInputElement> = (event) => {
        setNewData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };
    const onEnable = () => {};
    const onDisable = () => {};
    const onToggle = () => {
        if (isChangeFormOpen) {
            setNewData({
                deadline,
                destination,
                hardcap,
            });
        }

        setIsChangeFormOpen((prev) => !prev);
    };

    const onSubmit = () => {
        onChangeData(newData);
    };

    return (
        <div className="manage-donation">
            <div className="buttons">
                <button onClick={onToggle}>{isChangeFormOpen ? 'Cancel' : 'Change'}</button>
                <button onClick={onEnable}>Enable</button>
                <button onClick={onDisable}>Disable</button>
            </div>
            {isChangeFormOpen && (
                <form className="form">
                    <label>
                        <input value={newData.deadline} name="deadline" onChange={onChangeField} />
                    </label>
                    <label>
                        <input
                            value={newData.destination.toString()}
                            name="destination"
                            onChange={onChangeField}
                        />
                    </label>
                    <label>
                        <input value={newData.hardcap} name="hardcap" onChange={onChangeField} />
                    </label>
                    <button onClick={onSubmit}>submit</button>
                </form>
            )}
        </div>
    );
};
