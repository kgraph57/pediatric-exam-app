import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Keep them available via import.meta.env.NEXT_PUBLIC_*
  envPrefix: 'NEXT_PUBLIC_',
  optimizeDeps: {
    // Explicitly include fast-glob, since it gets dynamically imported and we
    // don't want that to cause a re-bundle.
    include: ['fast-glob', 'lucide-react'],
    exclude: [
      '@hono/auth-js/react',
      '@hono/auth-js',
      '@auth/core',
      '@hono/auth-js',
      'hono/context-storage',
      '@auth/core/errors',
      'fsevents',
      'lightningcss',
    ],
  },
  logLevel: 'info',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@chakra-ui/react', 'lucide-react'],
        },
      },
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
});
