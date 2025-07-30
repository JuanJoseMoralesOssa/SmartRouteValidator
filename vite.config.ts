import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@app': path.resolve(__dirname, './src/app'),
            '@features': path.resolve(__dirname, './src/features'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@config': path.resolve(__dirname, './src/config'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@assets': path.resolve(__dirname, './src/assets'),
        },
    },
    base: '/',
})
