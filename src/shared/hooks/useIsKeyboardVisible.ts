import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useIsKeyboardVisible({
  iosUseWillEvents,
}: {
  iosUseWillEvents?: boolean;
} = {}): [boolean] {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // NOTE
  // only iOS supports the "will" events
  const isIOS = Platform.OS === 'ios';

  const showEvent = isIOS && iosUseWillEvents ? 'keyboardWillShow' : 'keyboardDidShow';

  const hideEvent = isIOS && iosUseWillEvents ? 'keyboardWillHide' : 'keyboardDidHide';

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true),
    );

    const keyboardHideListener = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false),
    );

    return () => {
      keyboardHideListener.remove();
      keyboardShowListener.remove();
    };
  }, [showEvent, hideEvent]);

  return [isKeyboardVisible];
}
