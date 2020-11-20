import React, { useRef, useImperativeHandle, useState } from 'react';
import { Animated, TouchableOpacity, ScrollView, View, Platform } from 'react-native';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { getDynamicColor, getColor } from '../config/Colors';
import { isTablet } from '../utils/device';
import Icon from './icon';

export const TOOLBAR_HEIGHT = 40;

const TOOLBAR_ICON_SIZE = 22;

const BaseBtnList = [
  {
    type: 'header',
    iconName: 'title',
  },
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
    iconName: 'strickThrough',
  },
  {
    type: 'orderList',
    iconName: 'orderList',
  },
  {
    type: 'bulletList',
    iconName: 'bullet',
  },
  {
    type: 'link',
    iconName: 'link',
  },
  {
    type: 'checkedBox',
    iconName: 'todoList',
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
    iconName: 'divide',
  },
  {
    type: 'code',
    iconName: 'code-inline',
  },
  {
    type: 'codeBlock',
    iconName: 'code-block',
  },
  {
    type: 'quote',
    iconName: 'quote',
  },
  {
    type: 'indent',
    iconName: 'indent',
  },
  {
    type: 'unindent',
    iconName: 'unindent',
  },
];

const ipadEditList = [
  {
    type: 'undo',
    iconName: 'revoke',
  },
  {
    type: 'redo',
    iconName: 'redo',
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
    iconName: 'strickThrough',
  },
  {
    type: 'alignLeft',
    iconName: 'left',
  },
  {
    type: 'alignCenter',
    iconName: 'center',
  },
  {
    type: 'alignRight',
    iconName: 'right',
  },
  {
    type: 'insertRowBefore',
    iconName: 'insert-above',
  },
  {
    type: 'insertRowAfter',
    iconName: 'insert-under',
  },
  {
    type: 'insertColBefore',
    iconName: 'insert-left',
  },
  {
    type: 'insertColAfter',
    iconName: 'insert-right',
  },
  {
    type: 'deleteRow',
    iconName: 'table-delete-row',
  },
  {
    type: 'deleteCol',
    iconName: 'table-delete-col',
  },
  {
    type: 'deleteTable',
    iconName: 'table-delete',
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
  function handleExecuteCommand(type) {
    const editor = editorRef.current;
    if (editor) {
      editor.executeCommand(type);
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
      const top = Platform.select({
        default: keyboardHeight,
        android: 0,
      });
      if (enableAnimation) {
        console.debug(`animated show editor toolbar ${duration}`);
        Animated.spring(topValue, {
          duration: duration || 300,
          toValue: top,
          useNativeDriver: false,
          bounciness: 0,
        }).start();
      } else {
        topValue.setValue(top);
      }
    },
    changeToolbarType(selectionStatus) {
      setIsCursorInTable(selectionStatus.isCursorInTable);
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
          {(isTablet() ? ipadEditList : [])
            .concat(isCursorInTable ? TableBtnList : BaseBtnList)
            .map((item) => (
              <TouchableOpacity
                onPress={() => handleExecuteCommand(item.type)}
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
