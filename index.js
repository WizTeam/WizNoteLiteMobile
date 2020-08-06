/**
 * @format
 */
import {AppRegistry} from 'react-native';
import './wrapper';
import App from './App';
import {name as appName} from './app.json';
const wizApi = require('wiznote-sdk-js');

global.wizApi = wizApi;


(async () => {
  try {
    const allUsers = await wizApi.getUsers()
    console.log(allUsers);
    //
    let user = await wizApi.localLogin();
    if (!user) {
      console.log('failed to localLogin, do online login');
      //
      user = await users.onlineLogin('as.wiz.cn', 'xxx@xxx.xxx', 'xxxxxx');
      //
    } else {
      console.log('localLogin done');
      console.log(user);
    }
    //
  } catch (err) {
    console.error(err);
  }

})();


AppRegistry.registerComponent(appName, () => App);
