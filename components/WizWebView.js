import React from 'react';
import { View, StyleSheet, UIManager, NativeModules, requireNativeComponent, findNodeHandle } from 'react-native';

const WebViewInstance = NativeModules.WizWebViewInstanceManager;

const NativeWizWebView = requireNativeComponent('WizWebView');

export function injectJavaScript(js) {
  WebViewInstance.injectJavaScript(js);
}

export default class WizWebView extends React.Component {
  webViewRef = React.createRef();

  getWebViewHandle = () => {
    const nodeHandle = findNodeHandle(this.webViewRef.current);
    // invariant(nodeHandle != null, 'nodeHandle expected to be non-null');
    return nodeHandle;
  };

  getCommands = () => UIManager.getViewManagerConfig('WizWebView').Commands;

  injectJavaScript = (data) => {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      this.getCommands().injectJavaScript,
      [data],
    );
  };

  render() {
    const {
      style,
      containerStyle,
      ...otherProps
    } = this.props;
    const webViewContainerStyle = [styles.container, containerStyle];
    return (
      <View style={webViewContainerStyle}>
        <NativeWizWebView
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
