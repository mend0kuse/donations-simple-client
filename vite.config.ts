import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // https://github.com/vitejs/vite/discussions/2785#discussioncomment-7803485
        nodePolyfills({
            include: ['path', 'stream', 'util'],
            exclude: ['http'],
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
            overrides: {
                fs: 'memfs',
            },
            protocolImports: true,
        }),
    ],
});
