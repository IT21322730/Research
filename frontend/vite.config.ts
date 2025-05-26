import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: 'D:/Git/frontend/192.168.1.114-key.pem',
      cert: 'D:/Git/frontend/192.168.1.114.pem',
    },
    host: '0.0.0.0', // Allows access from other devices on the same network
    port: 8100,      // Default port, can change if needed
  },
});
