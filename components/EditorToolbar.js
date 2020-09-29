import React, { useRef, useImperativeHandle, useState } from 'react';
import { Animated, TouchableOpacity, ScrollView, View } from 'react-native';
import { useDynamicValue, DynamicStyleSheet } from 'react-native-dynamic';
import { getDynamicColor, getColor } from '../config/Colors';
import Icon from './Icon';

const TOOLBAR_HEIGHT = 40;

const TOOLBAR_ICON_SIZE = 22;

const EditorToolBar = React.forwardRef((props, ref) => {
  //
  const styles = useDynamicValue(dynamicStyles);
  const topValueRef = useRef(new Animated.Value(-TOOLBAR_HEIGHT));
  const [isCursorInTable, setIsCursorInTable] = useState(false);
  const topValue = topValueRef.current;
  //
  const editor = props.editorRef.current;
  //
  function handlePress(type) {
    if (editor) {
      if (type === 'image' && props.onInsertImage) {
        props.onInsertImage();
      } else {
        // TODO: execute editor command;
        editor.executeCommand(type);
      }
    }
  }

  const BaseBtnListRef = useRef([
    {
      type: 'tag',
      iconName: 'jinghao',
    },
    {
      type: 'bold',
      iconName: 'cuti',
    },
    {
      type: 'italic',
      iconName: 'xieti',
    },
    {
      type: 'deletedLine',
      iconName: 'shanchuxianstrikethrough2',
    },
    {
      type: 'orderList',
      iconName: 'youxuliebiao',
    },
    {
      type: 'bulletList',
      iconName: 'wuxuliebiao',
    },
    {
      type: 'link',
      iconName: 'lianjie',
    },
    {
      type: 'checkedBox',
      iconName: 'xuanzekuang',
    },
    {
      type: 'table',
      iconName: 'zu',
    },
    {
      type: 'image',
      iconName: 'image',
    },
    {
      type: 'dividingLine',
      iconName: 'fengexian',
    },
    {
      type: 'code',
      iconName: 'cc-code',
    },
    {
      type: 'codeBlock',
      iconName: 'hangneidaima',
    },
    {
      type: 'quote',
      iconName: 'zu1',
    },
    {
      type: 'formula',
      iconName: 'gongshi_putong',
    },
  ]);
  const TableBtnListRef = useRef([
    {
      type: 'bold',
      iconName: 'cuti',
    },
    {
      type: 'italic',
      iconName: 'xieti',
    },
    {
      type: 'deletedLine',
      iconName: 'shanchuxianstrikethrough2',
    },
    {
      type: 'checkedBox',
      iconName: 'xuanzekuang',
    },
    {
      type: 'alignLeft',
      iconName: 'duiqifangshi_zuo',
    },
    {
      type: 'alignCenter',
      iconName: 'duiqifangshi_zhong',
    },
    {
      type: 'alignRight',
      iconName: 'duiqifangshi_you',
    },
    {
      type: 'insertRowBefore',
      iconName: 'charuhang_shang',
    },
    {
      type: 'insertRowAfter',
      iconName: 'charuhang_xia',
    },
    {
      type: 'insertColBefore',
      iconName: 'charulie_zuo',
    },
    {
      type: 'insertColAfter',
      iconName: 'charulie_you',
    },
    {
      type: 'deleteRow',
      iconName: 'shanchuhang',
    },
    {
      type: 'deleteCol',
      iconName: 'shanchulie',
    },
    {
      type: 'deleteTable',
      iconName: 'shanchubiaoge',
    },
  ]);
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
          {(isCursorInTable ? TableBtnListRef : BaseBtnListRef).current.map((item) => (
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
