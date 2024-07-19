import { Address } from '@ton/core';
import { USER_ROLE, useConnectedUser } from '../../contracts/hooks/use-connected-user';
import { useDonationManager } from '../../contracts/hooks/use-donation-manager';
import { useState } from 'react';
import TonWeb from 'tonweb';

export const ManageAdmins = () => {
    const { user } = useConnectedUser();

    const { admins, removeAdmins, addAdmins } = useDonationManager();
    const [adminsToDelete, setAdminsToDelete] = useState<Address[]>([]);
    const [adminsToAdd, setAdminsToAdd] = useState<Address[]>([]);
    const [adminInput, setAdminInput] = useState('');

    if (!user || user.role !== USER_ROLE.OWNER) {
        return null;
    }

    const adminsArray = admins?.values() ?? [];

    const onAddAdmins = () => {
        addAdmins({ admins: adminsToAdd });
        alert('successfully added admins');
        setAdminsToAdd([]);
    };

    const onRemoveAdmins = async () => {
        await removeAdmins({ admins: adminsToDelete });
        alert('successfully removed admins');
        setAdminsToDelete([]);
    };

    const onFillAdmin = () => {
        if (!TonWeb.utils.Address.isValid(adminInput)) {
            alert('Invalid address');
            return;
        }

        setAdminsToAdd((prev) => [...prev, Address.parse(adminInput)]);
        setAdminInput('');
    };

    return (
        <div>
            <h2>Manage admins</h2>

            <div>
                <button onClick={onAddAdmins}>Add</button>
                <button onClick={onRemoveAdmins}>Remove</button>
            </div>

            <div>
                <h3>Admins to add</h3>

                <input value={adminInput} onChange={(e) => setAdminInput(e.target.value)} />
                <button onClick={onFillAdmin}>Add another one</button>

                <div>
                    {adminsToAdd.map((admin) => {
                        return (
                            <div>
                                <p>{admin.toString()}</p>
                                <button
                                    onClick={() =>
                                        setAdminsToAdd((prev) =>
                                            prev.filter((item) => item !== admin),
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3>Current admins</h3>

                {adminsArray.map((admin) => {
                    return (
                        <div>
                            <p>{admin.toString()}</p>
                            <div>
                                <label>
                                    <p color="red">In remove list</p>
                                    <input
                                        type="checkbox"
                                        checked={adminsToDelete.includes(admin)}
                                        onChange={() => {
                                            setAdminsToDelete((prev) =>
                                                prev.includes(admin)
                                                    ? prev.filter(
                                                          (a) => a.toString() !== admin.toString(),
                                                      )
                                                    : [...prev, admin],
                                            );
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
