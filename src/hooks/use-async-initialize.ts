import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAsyncInitialize = <T>(func: () => Promise<T>, deps: any[] = []) => {
    const [state, setState] = useState<T | null>(null);

    useEffect(() => {
        (async () => {
            setState(await func());
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return state;
};
