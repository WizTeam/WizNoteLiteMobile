import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../config/Colors';

export default function HighlightText({
  autoEscape,
  highlightStyle,
  style,
  text,
  ...props
}) {
  //
  const parts = ` ${text} `.replace(new RegExp('</em>', 'g'), '<em>').split('<em>');
  parts[0] = parts[0].trimStart();
  parts[parts.length - 1] = parts[parts.length - 1].trimEnd();
  console.log(parts);
  //
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Text style={[styles.style, style]} {...props}>
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return part;
        }
        // eslint-disable-next-line react/no-array-index-key
        return <Text key={`${index}`} style={[styles.highlightStyle, highlightStyle]}>{part}</Text>;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  style: {

  },
  highlightStyle: {
    color: Colors.primary,
  },
});

HighlightText.propTypes = {
  style: Text.propTypes.style,
  highlightStyle: Text.propTypes.style,
  text: PropTypes.string,
};

HighlightText.defaultProps = {
  style: null,
  highlightStyle: null,
  text: '',
};
