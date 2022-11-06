import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
    const { PORT } = loadEnv(mode, process.cwd(), 'PORT')

    return {
        define: {
            // workaround necessary for `deep-equal`
            'global.BigInt': 'globalThis.BigInt',
        },
        server: { port: PORT ? Number(PORT) : undefined },
        build: { outDir: 'build' },
        plugins: [react()],
        test: { globals: true },
    }
})
