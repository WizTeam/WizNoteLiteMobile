import { useMemo } from 'react';
import { getThemeColor } from '../config/Colors';

export function useThemeStyle(theme) {
  const color = getThemeColor(theme);
  return useMemo(() => {
    if (color) {
      return {
        mainBackground: {
          backgroundColor: color.primary,
        },
      };
    }
    return {};
  }, [theme, color]);
}
