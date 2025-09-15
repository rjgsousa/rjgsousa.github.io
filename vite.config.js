import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development' || process.env.NODE_ENV === 'development'
  
  return {
    server: isDev ? {
      allowedHosts: [
        'rsousa.co',
        'localhost',
        '127.0.0.1'
      ]
    } : {}
  }
})
