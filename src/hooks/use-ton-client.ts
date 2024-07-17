import { TonClient } from '@ton/ton';
import { useAsyncInitialize } from './use-async-initialize';
import { getHttpEndpoint } from '@orbs-network/ton-access';

export function useTonClient() {
    return useAsyncInitialize(async () => {
        return new TonClient({
            endpoint: await getHttpEndpoint({ network: 'testnet' }),
        });
    });
}
