import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  plugins: [
    // Используем только один плагин для React с настройками для автоматической трансформации JSX
    react({
      // You can keep your SWC plugins here
      tsDecorators: true,
      plugins: [
        ['@swc/plugin-transform-imports', {}],
      ],
    }),
    // Support for TypeScript paths
    tsconfigPaths(),
    // Compress assets for production
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240, // only compress files larger than 10kb
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 10240,
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mantine-core': ['@mantine/core', '@mantine/hooks'],
          'telegram-ui': ['@telegram-apps/telegram-ui', '@telegram-apps/sdk-react'],
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          jsx: 'react-jsx', // Указываем новую трансформацию JSX
        },
      },
    },
  },
  publicDir: './public',
  server: {
    // Expose dev server to devices on the network
    allowedHosts: ['ad0e-138-124-31-188.ngrok-free.app'],
    host: true,
  },
})
