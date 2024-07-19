import dayjs from 'dayjs';
import { USER_ROLE, useConnectedUser } from '../../contracts/hooks/use-connected-user';
import { useDonationManager } from '../../contracts/hooks/use-donation-manager';
import { Address, fromNano, toNano } from '@ton/core';
import { useState } from 'react';
import './create-donation-form.css';

// todo validation
export const CreateDonationForm = () => {
    const { user } = useConnectedUser();
    const { createDonation } = useDonationManager();

    const [contractInitialData, setContractInitialData] = useState({
        deadline: dayjs().add(30, 'days').format('YYYY-MM-DD'),
        destination: '',
        hardcap: toNano(100),
    });

    if (!user || user.role === USER_ROLE.USER) {
        return null;
    }

    const onSend = () => {
        createDonation({
            deadline: BigInt(dayjs(contractInitialData.deadline).unix()),
            destination: Address.parse(contractInitialData.destination),
            hardcap: BigInt(contractInitialData.hardcap),
        });
    };

    return (
        <div>
            <h2>Create donation</h2>
            <div className="create-donation-form">
                <label>
                    <p>deadline</p>
                    <input
                        value={contractInitialData.deadline}
                        onChange={(e) => {
                            setContractInitialData((prev) => ({
                                ...prev,
                                deadline: e.target.value,
                            }));
                        }}
                        type="date"
                    />
                </label>
                <label>
                    <p>hardcap in ton</p>
                    <input
                        value={fromNano(contractInitialData.hardcap)}
                        onChange={(e) => {
                            setContractInitialData((prev) => ({
                                ...prev,
                                hardcap: toNano(e.target.value),
                            }));
                        }}
                        type="number"
                    />
                </label>
                <label>
                    <p>destination</p>

                    <input
                        value={contractInitialData.destination}
                        onChange={(e) => {
                            setContractInitialData((prev) => ({
                                ...prev,
                                destination: e.target.value,
                            }));
                        }}
                        type="string"
                    />

                    <button
                        onClick={() => {
                            setContractInitialData((prev) => ({
                                ...prev,
                                destination: user.address,
                            }));
                        }}
                    >
                        put med
                    </button>
                </label>

                <button type="submit" onClick={onSend}>
                    Send
                </button>
            </div>
        </div>
    );
};
