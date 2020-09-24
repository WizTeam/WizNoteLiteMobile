import { showMessage, hideMessage } from '../thirdparty/react-native-flash-message';
import { Navigation } from '../thirdparty/react-native-navigation';
import { RNNDrawer } from '../thirdparty/react-native-navigation-drawer-extension';
import { isTablet } from '../utils/device';
import { loadRequest } from '../components/WizSingletonWebView';
import app from '../wrapper/app';
import { isDarkMode } from '../config/Colors';

export async function showTopBarMessage(options = {}) {
  const { message, description, onPress, closeTimeout = 3000, autoHide, buttons } = options;
  //
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
  let type = options.type;
  if (type === 'error') {
    // eslint-disable-next-line no-param-reassign
    type = 'danger';
  }
  //
  showMessage({
    message,
    description,
    type,
    onPress,
    autoHide,
    buttons,
  });
  //
  setTimeout(() => {
    Navigation.dismissOverlay(componentId);
  }, closeTimeout);
  //
  return componentId;
}

export function hideTopBarMessage(componentId) {
  hideMessage();
  if (componentId) {
    Navigation.dismissOverlay(componentId);
  }
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

export function showLogsDialog(options) {
  console.log('view log');
  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: 'ViewLogsScreen',
          passProps: options,
        },
      }],
    },
  });
}

export function showUpgradeViDialog(options) {
  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: 'UpgradeToVipScreen',
          passProps: options,
        },
      }],
      topBar: {
        visible: false,
      },
    },
  });
}

export function setMainAsRoot(isPad) {
  //
  const darkMode = isDarkMode();
  const theme = darkMode ? 'dark' : 'lite';
  const resPath = app.getPath('res');
  const tablet = isTablet() ? 'true' : 'false';
  const editorHtmlPath = `file://${resPath}/build/index.html?theme=${theme}&isTablet=${tablet}`;
  // const editorHtmlPath = `http://localhost:3000?theme=${theme}&isTablet=${tablet}`;
  // console.log(`load html: ${editorHtmlPath}`);
  loadRequest(editorHtmlPath);
  //
  let pad;
  if (isPad !== undefined) {
    pad = isPad;
  } else {
    pad = isTablet();
  }
  //
  if (pad) {
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
