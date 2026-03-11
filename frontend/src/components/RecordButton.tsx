// RecordButton Component
// 60×60dp circle with inner dot, pulse animation when recording

import React from 'react';
import { Pressable, View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';

interface RecordButtonProps {
  isRecording?: boolean;
  onPress: () => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({ isRecording = false, onPress }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    if (isRecording) {
      // Pulse animation: scale 1 → 0.78, opacity 0.9 → 0.25, 1200ms infinite
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 0.78,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0.25,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.9,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      opacityAnim.setValue(0.75);
    }
  }, [isRecording]);

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            pressed && styles.buttonPressed,
            isRecording && styles.buttonRecording,
          ]}
        >
          <Animated.View
            style={[
              styles.dot,
              isRecording && {
                transform: [{ scale: pulseAnim }],
                opacity: opacityAnim,
              },
            ]}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: Spacing.recordButtonSize,   // 60dp
    height: Spacing.recordButtonSize,  // 60dp
    borderRadius: Spacing.recordButtonSize / 2,
    borderWidth: 1,
    borderColor: Colors.border,         // #2C2C2C
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    borderColor: 'rgba(212,165,116,0.4)',
    shadowColor: Colors.ember,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonRecording: {
    borderColor: 'rgba(212,165,116,0.45)',
    shadowColor: Colors.ember,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  dot: {
    width: Spacing.recordDotSize,      // 15dp
    height: Spacing.recordDotSize,     // 15dp
    borderRadius: Spacing.recordDotSize / 2,
    backgroundColor: Colors.ember,      // #D4A574
    opacity: 0.75,
  },
});