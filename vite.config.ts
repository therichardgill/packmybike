import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAPS_API_KEY),
  },
  envPrefix: 'VITE_',
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'google-maps': ['@react-google-maps/api', 'use-places-autocomplete'],
        },
      },
    },
  },
});