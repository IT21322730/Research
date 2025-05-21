import { Platform } from '@ionic/react';
import { useEffect } from 'react';
import { Keyboard } from '@capacitor/keyboard';

const LoginPage = () => {
  const platform = usePlatform();

  useEffect(() => {
    if (platform.is('ios') || platform.is('android')) {
      Keyboard.setResizeMode(Keyboard.ResizeMode.Native); // Set the resize mode
    }
  }, [platform]);
};
