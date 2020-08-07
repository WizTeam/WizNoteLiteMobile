import './wrapper';
import { Navigation } from "react-native-navigation";
import { RNNDrawer } from "react-native-navigation-drawer-extension";
import App from "./App";
import MainDrawer from './components/MainDrawer';
import MainMenuButton from './components/MainMenuButton';

Navigation.registerComponent("MainDrawer", () => RNNDrawer.create(MainDrawer));
Navigation.registerComponent("MainMenuButton", () => MainMenuButton);
Navigation.registerComponent('cn.wiz.note.lite.WelcomeScreen', () => App);

Navigation.events().registerAppLaunchedListener(() => {
   Navigation.setRoot({
     root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'cn.wiz.note.lite.WelcomeScreen'
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: 'Notes',
                },
                topBar: {
                  title: {
                    text: 'WizNote Lite',
                  },
                }
              },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'cn.wiz.note.lite.WelcomeScreen'
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
                },
              },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'cn.wiz.note.lite.WelcomeScreen'
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
                },
              },
            },
          },
        ],
      },
     }
  });
});
