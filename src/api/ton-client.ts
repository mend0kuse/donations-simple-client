import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from '@ton/ton';

export const tonClient = new TonClient({
    endpoint: await getHttpEndpoint({ network: 'testnet' }),
});
