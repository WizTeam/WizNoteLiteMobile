import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { useDynamicValue } from 'react-native-dynamic';
import { EventEmitter } from 'events';

import { getDeviceDynamicColor, createDeviceDynamicStyles } from '../config/Colors';
import { formatDateString } from '../utils/date';
import HighlightText from './HighlightText';
import { KEYS, connect } from '../data_store';
import { useThemeStyle } from '../hook/useThemeStyle';

const starEventObject = new EventEmitter();
starEventObject.setMaxListeners(10000);

export function updateNoteStar(kbGuid, noteGuid, starred) {
  starEventObject.emit('updateNoteStar', kbGuid, noteGuid, starred);
}

const useForceUpdate = () => useState()[1];

function NoteListItem(props) {
  //
  const { onPressItem, note, selected, hideDivider } = props;
  const styles = useDynamicValue(dynamicStyles.styles);
  //
  let title = note.title;
  let subTitle = formatDateString(note.modified);
  if (props.showHighlight && note.highlight) {
    if (note.highlight.title) {
      const highlightText = note.highlight.title.join(' ');
      title = <HighlightText text={highlightText} style={styles.title} />;
    }
    if (note.highlight.text) {
      const allText = note.highlight.text.join(' ');
      const highlightText = `${allText}\n\n${subTitle}`;
      subTitle = <HighlightText text={highlightText} style={styles.subtitle} />;
    }
  }
  //
  const forceUpdateStarRef = useRef();
  //
  let showStar = !!(props.showStar && note.starred);
  if (forceUpdateStarRef.current !== undefined) {
    showStar = props.showStar && forceUpdateStarRef.current;
  }
  //
  const forceUpdate = useForceUpdate();
  //
  useEffect(() => {
    function updateStar(kbGuid, noteGuid, starred) {
      if (kbGuid === note.kbGuid && noteGuid === note.guid) {
        forceUpdateStarRef.current = starred;
        forceUpdate({ rand: new Date() });
        setTimeout(() => {
          forceUpdateStarRef.current = undefined;
        }, 100);
      }
    }
    starEventObject.addListener('updateNoteStar', updateStar);
    return () => {
      starEventObject.removeListener('updateNoteStar', updateStar);
    };
  }, []);

  const { mainBackground } = useThemeStyle(props[KEYS.USER_SETTING]?.colorTheme);
  //
  return (
    <View>
      <ListItem
        onPress={() => onPressItem(note)}
        key={note.guid}
        containerStyle={[styles.itemContainer, mainBackground, selected && styles.selected]}
      >
        <ListItem.Content style={styles.itemContent}>
          <ListItem.Title numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
            <Text>{title}</Text>
          </ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>{subTitle}</ListItem.Subtitle>
        </ListItem.Content>
        {showStar && <ListItem.Chevron name="star" size={20} color="rgb(253, 201, 46)" style={styles.star} />}
      </ListItem>
      <View style={styles.dividerContainer}>
        <Divider style={[styles.divider, hideDivider && styles.hideDivider]} />
      </View>
    </View>
  );
}

export default connect([
  KEYS.USER_SETTING,
])(NoteListItem);

const dynamicStyles = createDeviceDynamicStyles(() => ({
  list: {
  },
  itemContainer: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  itemContent: {
    paddingLeft: 8,
  },
  selected: {
    backgroundColor: getDeviceDynamicColor('noteListSelectedBackground'),
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    paddingBottom: 4,
    color: getDeviceDynamicColor('noteListTitle'),
  },
  subtitle: {
    fontSize: 14,
    color: getDeviceDynamicColor('noteListSubTitle'),
  },
  dividerContainer: {
    // backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  divider: {
    marginLeft: 22,
    marginRight: 16,
    backgroundColor: getDeviceDynamicColor('noteListDivider'),
  },
  hideDivider: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
  },
  star: {
    color: 'rgb(253, 201, 46)',
    paddingBottom: 24,
  },
}));
