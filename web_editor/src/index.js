import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import queryString from 'query-string';
import App from './App';
import { EditorViewer } from './EditorViewer';
import * as serviceWorker from './serviceWorker';

const params = queryString.parse(window.location.search);

ReactDOM.render(
  <React.StrictMode>
    {params.type === 'viewer' ? <EditorViewer /> : <App />}
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
