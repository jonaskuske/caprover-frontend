import preact from '@preact/preset-vite'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv, normalizePath } from 'vite'
import fonts from 'vite-plugin-webfont-dl'

const resolve = (p) => normalizePath(fileURLToPath(new URL(p, import.meta.url)))

export default defineConfig(({ mode }) => {
    const { PORT } = loadEnv(mode, process.cwd(), 'PORT')

    return {
        // workaround necessary for `deep-equal`
        define: { 'global.BigInt': 'globalThis.BigInt' },
        plugins: [preact(), fonts()],
        server: { port: PORT ? Number(PORT) : undefined },
        build: {
            outDir: 'build',
            rollupOptions: {
                input: [
                    resolve('./index.html'),
                    resolve('./src/styles/dark-theme.less'),
                    resolve('./src/styles/light-theme.less'),
                ],
                output: {
                    assetFileNames({ name }) {
                        const isTheme = /(dark|light)-theme\.css$/.test(name!)
                        return `assets/[name]${isTheme ? '' : '.[hash]'}.[ext]`
                    },
                },
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
