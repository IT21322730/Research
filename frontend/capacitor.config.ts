import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'frontend',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      // No resize configuration, as it's not implemented on Android
    },
  },
};

export default config;
