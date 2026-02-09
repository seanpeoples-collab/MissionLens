import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Check local .env first, then system environment (Netlify)
  // Default to empty string to prevent JSON.stringify(undefined)
  const apiKey = env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Injects the key into the code at build time
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})