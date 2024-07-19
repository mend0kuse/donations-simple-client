import { useEffect, useState } from 'react';

// todo add is loading
export const useAsyncInitialize = <T>(
    func: () => Promise<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deps: any[] = [],
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] => {
    const [state, setState] = useState<T | null>(null);

    useEffect(() => {
        (async () => {
            setState(await func());
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return [state, setState];
};
