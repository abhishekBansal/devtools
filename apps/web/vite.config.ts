import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {
    // Ensure environment variables are available at build time
    'import.meta.env.VITE_GA_MEASUREMENT_ID': JSON.stringify(process.env.VITE_GA_MEASUREMENT_ID),
  },
});
