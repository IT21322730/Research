import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    host: '0.0.0.0',  // This will allow access from other devices in the same network
    port: 5173,        // Default port, can be modified if needed
  },
});