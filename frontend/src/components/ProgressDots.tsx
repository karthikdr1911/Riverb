// ProgressDots Component
// 19 dots for onboarding flow, active dot expands to 14dp width

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';

interface ProgressDotsProps {
  total?: number;       // Total number of dots (default 19)
  currentIndex: number; // 0-based index of active dot
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total = 19, currentIndex }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          bottom: Spacing.progressDotsBottom + insets.bottom,
        },
      ]}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === currentIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive && styles.dotActive,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.progressDotGap,  // 5dp gap between dots
    zIndex: 295,
  },
  dot: {
    width: Spacing.progressDotSize,      // 3dp
    height: Spacing.progressDotSize,     // 3dp
    borderRadius: Spacing.progressDotSize / 2,  // 50% for circle
    backgroundColor: Colors.textDim,     // #444444
    transition: 'all 0.3s',  // Note: React Native doesn't support CSS transitions
  },
  dotActive: {
    width: Spacing.progressDotActiveWidth,  // 14dp
    height: Spacing.progressDotSize,        // 3dp (height stays same)
    borderRadius: 2,                        // 2dp for pill shape
    backgroundColor: Colors.ember,          // #D4A574
  },
});
