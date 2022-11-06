import preact from '@preact/preset-vite'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv, normalizePath } from 'vite'

const resolve = (p) => normalizePath(fileURLToPath(new URL(p, import.meta.url)))

export default defineConfig(({ mode }) => {
    const { PORT } = loadEnv(mode, process.cwd(), 'PORT')

    return {
        // workaround necessary for `deep-equal`
        define: { 'global.BigInt': 'globalThis.BigInt' },
        plugins: [preact()],
        server: { port: PORT ? Number(PORT) : undefined },
        build: {
            outDir: 'build',
            rollupOptions: {
                input: [
                    resolve('./index.html'),
                    resolve('./src/styles/dark-theme.less'),
                    resolve('./src/styles/light-theme.less'),
                ],
                output: { assetFileNames: 'themes/[name].[ext]' },
            },
        },
        css: {
            preprocessorOptions: {
                less: { javascriptEnabled: true },
            },
        },
        test: { globals: true },
    }
})
