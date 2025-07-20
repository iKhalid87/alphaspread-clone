// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module for resolving aliases

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Define path aliases for cleaner imports
      // For example, you can now use: import Component from '@/components/Component';
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      // Add more aliases as needed for your project structure
    },
  },
  css: {
    devSourcemap: true,
    // Tailwind CSS and PostCSS are typically configured via postcss.config.js
    // If you don't have postcss.config.js, you might add a postcss property here:
    // postcss: {
    //   plugins: [
    //     require('tailwindcss'),
    //     require('autoprefixer'),
    //   ],
    // },
  },
  // If you store .env files in a specific directory, uncomment and adjust:
  // envDir: './env',
});
