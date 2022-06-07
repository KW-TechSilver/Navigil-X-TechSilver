import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from 'core/theme';

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.colors.secondary,
  },
});

const Paragraph = ({ fontSize, color, margin, children, ...rest }) => (
  <Text style={[styles.text, { fontSize, color, margin, ...rest }]}>{children}</Text>
);

export default memo(Paragraph);
