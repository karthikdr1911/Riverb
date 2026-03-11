// AmbientGlow Component
// Radial gradient warm light with no visible boundary
// Dissolves invisibly into #131313 background

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const GLOW_SIZE = 500; // 500×500dp minimum

export const AmbientGlow: React.FC = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={[
          Colors.emberGlow065,     // rgba(212,165,116,0.065) at center
          'rgba(212,165,116,0.045)', // Fade through ember tones
          'rgba(212,165,116,0.022)',
          'rgba(212,165,116,0.009)',
          'rgba(19,19,19,0)',      // Surface color at zero opacity - no visible edge
        ]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    left: '50%',
    top: '50%',
    marginLeft: -GLOW_SIZE / 2,
    marginTop: -GLOW_SIZE / 2,
    zIndex: 0,
  },
  gradient: {
    width: '100%',
    height: '100%',
    // NO borderRadius - no visible circle shape
    // Gradient dissolves into background with no discernible edge
    opacity: 0.95, // Subtle fade for softer glow
  },
});
