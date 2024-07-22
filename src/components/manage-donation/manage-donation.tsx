import { Address } from '@ton/core';
import { ChangeEventHandler, useState } from 'react';
import { USER_ROLE, useConnectedUser } from '../../contracts/hooks/use-connected-user';
import { DonationData, DonationDataPayload } from '../../contracts/wrappers/donation';
import './manage-donation.css';

export const ManageDonation = ({
    donation: { deadline, destination, hardcap },
    onChangeData,
    onDisable,
    onEnable,
}: {
    donation: DonationData;
    onChangeData: (data: DonationDataPayload) => void;
    onEnable: () => void;
    onDisable: () => void;
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

    if (!user) {
        return null;
    }

    const isOwner = Address.parse(destination).equals(Address.parse(user.address));

    if (!isOwner && user.role === USER_ROLE.USER) {
        return null;
    }

    const onChangeField: ChangeEventHandler<HTMLInputElement> = (event) => {
        setNewData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

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
                {isOwner && (
                    <button onClick={onToggle}>{isChangeFormOpen ? 'Cancel' : 'Change'}</button>
                )}

                {!isOwner && (
                    <>
                        <button onClick={onEnable}>Enable</button>
                        <button onClick={onDisable}>Disable</button>
                    </>
                )}
            </div>
            {isChangeFormOpen && (
                <div className="form">
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
                    <button type="submit" onClick={onSubmit}>
                        submit
                    </button>
                </div>
            )}
        </div>
    );
};
