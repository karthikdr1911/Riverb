// BackButton Component
// Top-left "←" navigation, appears on all screens except S1, S8, S9

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Fonts } from '../constants/Fonts';
import { Spacing } from '../constants/Spacing';

interface BackButtonProps {
  onPress: () => void;
  visible?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, visible = true }) => {
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          top: insets.top + 20,  // Safe area + 20dp offset
          left: Spacing.backButtonLeft,  // 22dp
        },
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.text,
            pressed && styles.textPressed,
          ]}
        >
          ←
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: 20,
    padding: 8,  // Touch target padding
  },
  text: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.backArrow,  // 12dp (0.75rem)
    color: Colors.textDim,            // #444444
    letterSpacing: Fonts.sizes.backArrow * Fonts.letterSpacing.normal,  // 0.04em
  },
  textPressed: {
    color: Colors.textMuted,  // #888888 on press
  },
});
