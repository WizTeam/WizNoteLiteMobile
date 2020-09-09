import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { DynamicStyleSheet, useDynamicValue } from 'react-native-dynamic';

import { getDeviceDynamicColor } from '../config/Colors';
import { formatDateString } from '../utils/date';
import HighlightText from './HighlightText';

export default function NoteListItem(props) {
  //
  const { onPressItem, note, selected, hideDivider } = props;
  const styles = useDynamicValue(dynamicStyles);
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
  const showStar = !!(props.showStar && note.starred);
  //
  return (
    <View>
      <ListItem
        onPress={() => onPressItem(note)}
        key={note.guid}
        containerStyle={[styles.itemContainer, selected && styles.selected]}
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

const dynamicStyles = new DynamicStyleSheet({
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
    fontWeight: '400',
    paddingBottom: 8,
    color: getDeviceDynamicColor('noteListTitle'),
  },
  subtitle: {
    fontSize: 14,
    color: getDeviceDynamicColor('noteListSubTitle'),
  },
  dividerContainer: {
    backgroundColor: getDeviceDynamicColor('noteListBackground'),
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
});
