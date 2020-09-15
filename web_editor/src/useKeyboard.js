import { useState, useEffect } from "react";

export function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    window.onKeyboardShow = (keyboardWidth, height) => {
      setKeyboardHeight(height);
      return true;
    };
    //
    window.onKeyboardHide = () => {
      setKeyboardHeight(0);
      return true;
    };
  }, []);
  return {
    keyboardHeight
  }
}