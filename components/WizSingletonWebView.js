import React from 'react';
import {
  View, StyleSheet, UIManager, NativeEventEmitter,
  NativeModules, requireNativeComponent, findNodeHandle,
} from 'react-native';

const WizSingletonWebViewModule = NativeModules.WizSingletonWebViewModule;
const WizSingletonWebViewModuleEventObject = new NativeEventEmitter(WizSingletonWebViewModule);

let webViewLoaded = false;
let jsWaitForInject = null;

WizSingletonWebViewModuleEventObject.addListener('onLoad', () => {
  webViewLoaded = true;
  if (jsWaitForInject) {
    injectJavaScript(jsWaitForInject);
  }
});

export function addWebViewEventHandler(event, handler) {
  WizSingletonWebViewModuleEventObject.addListener(event, handler);
}

export function injectJavaScript(js) {
  if (webViewLoaded) {
    return WizSingletonWebViewModule.injectJavaScript(js);
  }
  jsWaitForInject = js;
  return Promise.resolve();
}

export function loadRequest(url) {
  WizSingletonWebViewModule.loadRequest(url);
}

export function endEditing(force) {
  WizSingletonWebViewModule.endEditing(!!force);
}

const NativeWizSingletonWebView = requireNativeComponent('WizSingletonWebView');

export default class WizSingletonWebView extends React.Component {
  webViewRef = React.createRef();

  getWebViewHandle = () => {
    const nodeHandle = findNodeHandle(this.webViewRef.current);
    // invariant(nodeHandle != null, 'nodeHandle expected to be non-null');
    return nodeHandle;
  };

  getCommands = () => UIManager.getViewManagerConfig('WizSingletonWebView').Commands;

  injectJavaScript = async (data) => UIManager.dispatchViewManagerCommand(
    this.getWebViewHandle(),
    this.getCommands().injectJavaScript,
    [data],
  );

  render() {
    const {
      style,
      containerStyle,
      ...otherProps
    } = this.props;
    const webViewContainerStyle = [styles.container, containerStyle];
    return (
      <View style={webViewContainerStyle}>
        <NativeWizSingletonWebView
          ref={this.webViewRef}
          style={[styles.container, styles.webView, style]}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...otherProps}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
