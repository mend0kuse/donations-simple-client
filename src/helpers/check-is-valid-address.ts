import TonWeb from 'tonweb';

export const checkIsValidAddress = (address: string) => {
    return TonWeb.utils.Address.isValid(address);
};
