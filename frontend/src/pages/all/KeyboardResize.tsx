import React, { useEffect } from 'react';
import { isPlatform } from '@ionic/react';
import { Keyboard } from '@capacitor/keyboard';

const KeyboardResize: React.FC = () => {
  useEffect(() => {
    if (isPlatform('android') || isPlatform('ios')) {
      // Wrap the resize mode check in try-catch to ignore errors
      try {
        // Attempt to get or set resize mode
        const resizeMode = Keyboard.getResizeMode(); // If called
        console.log('Resize mode:', resizeMode);
      } catch (error) {
        // Catch the error silently without disrupting the UI
        console.warn('Error getting resize mode, ignoring:', error);
      }

      // Handle keyboard show and hide events
      const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (info) => {
        console.log('Keyboard will show', info);
        // Adjust your UI here if needed (e.g., adding bottom padding)
      });

      const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
        console.log('Keyboard will hide');
        // Revert UI adjustments here
      });

      return () => {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      };
    }
  }, []);

  return (
    <div>
      <h1>Keyboard Event Listener</h1>
      <p>Check the console for keyboard events.</p>
    </div>
  );
};

export default KeyboardResize;
