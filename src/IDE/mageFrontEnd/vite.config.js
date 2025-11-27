import { fileURLToPath, URL } from 'node:url'
import { prismjsPlugin } from 'vite-plugin-prismjs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 设置基础路径
  plugins: [
    vue(),
    prismjsPlugin({
      languages: 'all', // 语言
      plugins: ['line-numbers', 'show-language', 'copy-to-clipboard', 'inline-color'],
      theme: 'tomorrow',// 主题
      css: true,
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
