/**
 * @format
 */
import {AppRegistry} from 'react-native';
import './wrapper';
import App from './App';
import {name as appName} from './app.json';
const wizApi = require('wiznote-sdk-js');

global.wizApi = wizApi;

AppRegistry.registerComponent(appName, () => App);
