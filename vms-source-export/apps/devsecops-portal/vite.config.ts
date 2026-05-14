import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'mermaid': path.resolve(__dirname, 'node_modules/mermaid'),
      '@': path.resolve(__dirname, '../../src'),
    }
  }
})
