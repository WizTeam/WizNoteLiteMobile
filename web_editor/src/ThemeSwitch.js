import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

export default function ThemeSwitcher(Props) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => createMuiTheme({
      unstable_strictMode: true,
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
      },
      panelBackgroundColor: prefersDarkMode ? '#434343' : '#f7f7f7'
    }),
    [prefersDarkMode],
  );
  return (
    <ThemeProvider theme={theme}>
      {Props.children}
    </ThemeProvider>
  )
}

ThemeSwitcher.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]).isRequired,
};
