import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import viteReact from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tsConfigpaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const localEnv = loadEnv(mode, process.cwd(), '')
  const rootEnv = loadEnv(mode, path.resolve(process.cwd(), '../'), '')

  const env = { ...rootEnv, ...localEnv }

  return {
    define: {
      'process.env': env,
    },
    server: {
      port: 3000,
    },
    plugins: [tsConfigpaths(), tanstackStart({ target: 'vercel', customViteReactPlugin: true }), viteReact()],
  }
})
