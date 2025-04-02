import swc from 'unplugin-swc'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/tma/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  plugins: [
    // Используем только один плагин для React с настройками для автоматической трансформации JSX
    swc.vite(),
    react(),
    // Support for TypeScript paths
    tsconfigPaths(),
    // Create SSL certificate for HTTPS development
    process.env.HTTPS && mkcert(),
    // Bundle analyzer (open stats.html after build to see bundle size)
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
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
    // Generate source maps only in development
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          jsx: 'react-jsx', // Указываем новую трансформацию JSX
        },
      },
    },
  },
  publicDir: './public',
  server: {
    // Expose dev server to devices on the network
    host: true,
  },
})
