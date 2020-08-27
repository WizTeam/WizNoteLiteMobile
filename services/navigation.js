/* eslint-disable import/no-unresolved */
import { Navigation } from 'react-native-navigation';
import { RNNDrawer } from 'react-native-navigation-drawer-extension';
import { showMessage } from "react-native-flash-message";

import { isTablet } from '../utils/device';

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
        bottomTabs: {
          children: [
            {
              stack: {
                children: [
                  {
                    component: {
                      name: 'NotesScreen',
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    text: 'Notes',
                    icon: require('../images/icons/notes.png'),
                  },
                  topBar: {
                    title: {
                      text: 'WizNote Lite',
                    },
                  },
                },
              },
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      name: 'StarredNotesScreen',
                    },
                  },
                ],
                options: {
                  topBar: {
                    title: {
                      text: 'Starred',
                    },
                  },
                  bottomTab: {
                    text: 'Starred',
                    icon: require('../images/icons/starred.png'),
                  },
                },
              },
            },
            {
              stack: {
                children: [
                  {
                    component: {
                      name: 'SearchNotesScreen',
                    },
                  },
                ],
                options: {
                  topBar: {
                    title: {
                      text: 'Default Title',
                    },
                  },
                  bottomTab: {
                    text: 'Search',
                    icon: require('../images/icons/search.png'),
                  },
                },
              },
            },
          ],
        },
      },
    });
  }
}
