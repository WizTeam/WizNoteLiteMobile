/* eslint-disable import/no-unresolved */
import i18n from 'i18n-js';
import { showMessage } from 'react-native-flash-message';

import { Navigation } from '../thirdparty/react-native-navigation';
import { RNNDrawer } from '../thirdparty/react-native-navigation-drawer-extension';
import { isTablet } from '../utils/device';
import { loadRequest } from '../components/WizSingletonWebView';
import app from '../wrapper/app';
import { isDarkMode } from '../config/Colors';

export async function showTopBarMessage({ message, description, type }) {
  const componentId = await Navigation.showOverlay({
    component: {
      name: 'TopBarFlashMessages',
      passProps: {},
      options: {
        overlay: {
          interceptTouchOutside: false,
        },
        layout: {
          componentBackgroundColor: 'transparent',
          orientation: ['portrait'],
        },
      },
    },
  });
  //
  showMessage({
    message,
    description,
    type,
  });
  //
  setTimeout(() => {
    Navigation.dismissOverlay(componentId);
  }, 3000);
}

export function closeDrawer() {
  RNNDrawer.dismissDrawer();
}

export function setLoginAsRoot() {
  Navigation.setRoot({
    root: {
      stack: {
        id: 'stack',
        children: [
          {
            component: {
              id: 'LoginScreen',
              name: 'LoginScreen',
            },
          },
        ],
      },
    },
  });
}

export function showLoginDialog(options) {
  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: 'LoginScreen',
          passProps: options,
        },
      }],
    },
  });
}

export function setMainAsRoot() {
  //
  const darkMode = isDarkMode();
  const theme = darkMode ? 'dark' : 'lite';
  const resPath = app.getPath('res');
  const tablet = isTablet ? 'true' : 'false';
  // const editorHtmlPath = `file://${resPath}/build/index.html?theme=${theme}&isTablet=${tablet}`;
  const editorHtmlPath = `http://localhost:3000?theme=${theme}&isTablet=${tablet}`;
  // console.log(`load html: ${editorHtmlPath}`);
  loadRequest(editorHtmlPath);
  //
  if (isTablet) {
    Navigation.setRoot({
      root: {
        stack: {
          id: 'stack',
          children: [
            {
              component: {
                id: 'PadMainScreen',
                name: 'PadMainScreen',
              },
            },
          ],
        },
      },
    });
  } else {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'NotesScreen',
              },
            },
          ],
          options: {
            topBar: {
              title: {
                text: 'WizNote Lite',
              },
            },
          },
        },
      },
    });
  }
}
