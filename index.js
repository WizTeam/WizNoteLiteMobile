/**
 * @format
 */
import {AppRegistry} from 'react-native';
import './wrapper';
import App from './App';
import {name as appName} from './app.json';
import wizApi from './sdk';

global.wizApi = wizApi;

AppRegistry.registerComponent(appName, () => App);
