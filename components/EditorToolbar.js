import React, { useRef, useImperativeHandle, useState } from 'react';
import { Animated, TouchableOpacity, ScrollView, View } from 'react-native';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { getDynamicColor, getColor } from '../config/Colors';
import Icon from './icon';

export const TOOLBAR_HEIGHT = 40;

const TOOLBAR_ICON_SIZE = 22;

const BaseBtnList = [
  {
    type: 'tag',
    iconName: 'tag',
  },
  {
    type: 'bold',
    iconName: 'bold',
  },
  {
    type: 'italic',
    iconName: 'italic',
  },
  {
    type: 'deletedLine',
    iconName: 'deletedLine',
  },
  {
    type: 'orderList',
    iconName: 'orderList',
  },
  {
    type: 'bulletList',
    iconName: 'bulletList',
  },
  {
    type: 'link',
    iconName: 'link',
  },
  {
    type: 'checkedBox',
    iconName: 'checkedBox',
  },
  {
    type: 'table',
    iconName: 'table',
  },
  {
    type: 'image',
    iconName: 'image',
  },
  {
    type: 'dividingLine',
    iconName: 'dividingLine',
  },
  {
    type: 'code',
    iconName: 'code',
  },
  {
    type: 'codeBlock',
    iconName: 'codeBlock',
  },
  {
    type: 'quote',
    iconName: 'quote',
  },
  {
    type: 'formula',
    iconName: 'formula',
  },
];

const TableBtnList = [
  {
    type: 'bold',
    iconName: 'bold',
  },
  {
    type: 'italic',
    iconName: 'italic',
  },
  {
    type: 'deletedLine',
    iconName: 'deletedLine',
  },
  {
    type: 'checkedBox',
    iconName: 'checkedBox',
  },
  {
    type: 'alignLeft',
    iconName: 'alignLeft',
  },
  {
    type: 'alignCenter',
    iconName: 'alignCenter',
  },
  {
    type: 'alignRight',
    iconName: 'alignRight',
  },
  {
    type: 'insertRowBefore',
    iconName: 'insertRowBefore',
  },
  {
    type: 'insertRowAfter',
    iconName: 'insertRowAfter',
  },
  {
    type: 'insertColBefore',
    iconName: 'insertColBefore',
  },
  {
    type: 'insertColAfter',
    iconName: 'insertColAfter',
  },
  {
    type: 'deleteRow',
    iconName: 'deleteRow',
  },
  {
    type: 'deleteCol',
    iconName: 'deleteCol',
  },
  {
    type: 'deleteTable',
    iconName: 'deleteTable',
  },
];

const EditorToolBar = React.forwardRef((props, ref) => {
  //
  const styles = useDynamicValue(dynamicStyles);
  const topValueRef = useRef(new Animated.Value(-TOOLBAR_HEIGHT));
  const [isCursorInTable, setIsCursorInTable] = useState(false);
  const topValue = topValueRef.current;
  //
  const editorRef = useRef(null);
  //
  function handlePress(type) {
    const editor = editorRef.current;
    if (editor) {
      if (type === 'image' && props.onInsertImage) {
        props.onInsertImage();
      } else {
        // TODO: execute editor command;
        editor.executeCommand(type);
      }
    }
  }
  //
  //
  useImperativeHandle(ref, () => ({
    setEditor: (editor) => {
      editorRef.current = editor;
    },
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
    changeCursorStatus(val) {
      setIsCursorInTable(val);
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
          {(isCursorInTable ? TableBtnList : BaseBtnList).map((item) => (
            <TouchableOpacity
              onPress={() => handlePress(item.type)}
              key={item.type}
              style={styles.iconBtn}
            >
              <Icon name={item.iconName} size={TOOLBAR_ICON_SIZE} color={getColor('toolbarIconColor')} />
            </TouchableOpacity>
          ))}
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
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: getDynamicColor('toolbarBackground'),
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%',
  },
  iconBtn: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EditorToolBar;
