import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// HBuilder X 打开的是官方 Vite CLI 工程：源码在 src/，编译器在本仓库。
export default defineConfig({
  plugins: [uni()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
