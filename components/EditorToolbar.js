import React, { useRef, useImperativeHandle } from 'react';
import { Animated, Button, ScrollView, View } from 'react-native';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';

const TOOLBAR_HEIGHT = 60;

const EditorToolBar = React.forwardRef((props, ref) => {
  //
  const styles = useDynamicValue(dynamicStyles);
  const topValueRef = useRef(new Animated.Value(-TOOLBAR_HEIGHT));
  const topValue = topValueRef.current;
  //
  const editor = props.editorRef.current;
  //
  function handleHead1() {
    if (editor) {
      // TODO: execute editor command;
      editor.executeCommand('head1');
    }
  }
  //
  //
  useImperativeHandle(ref, () => ({
    hide: (enableAnimation, duration) => {
      if (enableAnimation) {
        console.debug(`animated hide editor toolbar, ${duration}`);
        Animated.timing(topValue, {
          duration: duration || 300,
          toValue: -TOOLBAR_HEIGHT,
          useNativeDriver: false,
        }).start();
      } else {
        topValue.setValue(-TOOLBAR_HEIGHT);
      }
    },
    show: (enableAnimation, keyboardHeight, duration) => {
      if (enableAnimation) {
        console.debug(`animated show editor toolbar ${duration}`);
        Animated.timing(topValue, {
          duration: duration || 300,
          toValue: keyboardHeight,
          useNativeDriver: false,
        }).start();
      } else {
        topValue.setValue(keyboardHeight);
      }
    },
  }));
  //
  const topStyle = {
    bottom: topValue,
  };
  //
  return (
    <Animated.View style={[styles.root, topStyle]}>
      <ScrollView style={styles.scroll} horizontal>
        <View style={styles.container}>
          <Button onPress={handleHead1} title="h1" />
          <Button onPress={handleHead1} title="h2" />
          <Button onPress={handleHead1} title="h3" />
          <Button onPress={handleHead1} title="h4" />
          <Button onPress={handleHead1} title="h5" />
          <Button onPress={handleHead1} title="h6" />
          <Button onPress={handleHead1} title="h7" />
          <Button onPress={handleHead1} title="h8" />
          <Button onPress={handleHead1} title="h9" />
          <Button onPress={handleHead1} title="h10" />
          <Button onPress={handleHead1} title="h11" />
          <Button onPress={handleHead1} title="h12" />
          <Button onPress={handleHead1} title="h13" />
          <Button onPress={handleHead1} title="h14" />
        </View>
      </ScrollView>
    </Animated.View>
  );
});

const dynamicStyles = new DynamicStyleSheet({
  root: {
    position: 'absolute',
    height: TOOLBAR_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'red',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    minWidth: '100%',
  },
});

export default EditorToolBar;
