// S13 - Ready Screen
// Stats: 1 entry, 1 mirror moment, 1 chapter

import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Pressable, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedReanimated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { ProgressDots } from '../../src/components/ProgressDots';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

export default function ReadyScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateScreenEntry(opacity, translateY);
    
    // Start slow rotation animation for ✻ symbol
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 22000, // 22 seconds
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScreenWrapper showGlow={true} centered={true} scrollable={false}>
      <AnimatedReanimated.View style={[styles.container, animatedStyle]}>
        {/* Rotating symbol */}
        <Animated.Text style={[styles.symbol, { transform: [{ rotate: spin }] }]}>
          ✻
        </Animated.Text>
        
        <Text style={styles.heading}>You're ready.</Text>
        
        <Text style={styles.lead}>
          Your first entry is saved.{"\n"}
          The mirror is listening.{"\n"}
          Your story has begun.
        </Text>
        
        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>entry</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>mirror moment</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>chapter</Text>
          </View>
        </View>
        
        <Pressable
          style={styles.button}
          onPress={() => router.push('/(onboarding)/afterglow-question')}
        >
          <Text style={styles.buttonText}>continue →</Text>
        </Pressable>
      </AnimatedReanimated.View>
      
      <ProgressDots currentIndex={12} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  symbol: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.readySymbol,  // 32dp (2rem)
    color: Colors.ember,
    marginBottom: 24,
    // Slow rotation animation would be added here
  },
  heading: {
    fontFamily: Fonts.display,
    fontWeight: '300',
    fontSize: Fonts.sizes.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 19.2,
  },
  lead: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.lead,
    fontWeight: '300',
    lineHeight: Fonts.sizes.lead * Fonts.lineHeights.loose,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 32,
  },
  stats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.statNumber,  // 21.6dp
    fontWeight: '300',
    color: Colors.ember,
    marginBottom: 6,
  },
  statLabel: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.caption,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(Fonts.sizes.caption, Fonts.letterSpacing.medium),
    textTransform: 'lowercase',
  },
  button: {
    paddingVertical: 12.48,
    paddingHorizontal: 27.2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
  },
  buttonText: {
    fontFamily: Fonts.ui,
    fontSize: 11.2,
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(11.2, 0.13),
    textTransform: 'lowercase',
  },
});