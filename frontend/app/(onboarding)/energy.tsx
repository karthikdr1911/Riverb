// S6 - Energy Battery Picker
// Three custom battery components, continue button disabled until selection

import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { BackButton } from '../../src/components/BackButton';
import { ProgressDots } from '../../src/components/ProgressDots';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { Spacing } from '../../src/constants/Spacing';
import { animateScreenEntry } from '../../src/utils/animations';

type EnergyLevel = 'low' | 'medium' | 'high';

interface BatteryConfig {
  level: EnergyLevel;
  label: string;
  bodyHeight: number;
  fillHeight: number;
}

const BATTERIES: BatteryConfig[] = [
  { level: 'low', label: 'running\non fumes', bodyHeight: 40, fillHeight: 11 },
  { level: 'medium', label: 'steady,\nnot sparkling', bodyHeight: 54, fillHeight: 28 },
  { level: 'high', label: 'fully\ncharged', bodyHeight: 68, fillHeight: 56 },
];

export default function EnergyScreen() {
  const router = useRouter();
  const { energyLevel, setEnergyLevel } = useOnboarding();
  const [selected, setSelected] = useState<EnergyLevel | null>(energyLevel);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    animateScreenEntry(opacity, translateY);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleContinue = () => {
    if (selected) {
      setEnergyLevel(selected);
      router.push('/(onboarding)/first-prompt');
    }
  };

  return (
    <ScreenWrapper showGlow={true} centered={true}>
      <BackButton onPress={() => router.back()} visible={true} />
      
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.heading}>
          What's your energy{"\n"}
          level right now?
        </Text>
        
        <Text style={styles.caption}>no judgment. just noticing.</Text>
        
        <View style={styles.batteriesContainer}>
          {BATTERIES.map((battery) => (
            <Pressable
              key={battery.level}
              style={styles.batteryOption}
              onPress={() => setSelected(battery.level)}
            >
              {/* Battery tip */}
              <View style={[
                styles.batteryTip,
                selected === battery.level && styles.batteryTipSelected,
              ]} />
              
              {/* Battery body */}
              <View style={[
                styles.batteryBody,
                { height: battery.bodyHeight },
                selected === battery.level && styles.batteryBodySelected,
              ]}>
                <View style={[
                  styles.batteryFill,
                  { height: battery.fillHeight },
                  selected === battery.level && styles.batteryFillSelected,
                ]} />
              </View>
              
              {/* Battery label */}
              <Text style={[
                styles.batteryLabel,
                selected === battery.level && styles.batteryLabelSelected,
              ]}>
                {battery.label}
              </Text>
            </Pressable>
          ))}
        </View>
        
        <Pressable 
          style={[
            styles.button,
            !selected && styles.buttonDisabled,
          ]} 
          onPress={handleContinue}
          disabled={!selected}
        >
          <Text style={[
            styles.buttonText,
            !selected && styles.buttonTextDisabled,
          ]}>
            continue →
          </Text>
        </Pressable>
      </Animated.View>
      
      <ProgressDots currentIndex={5} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  heading: {
    fontFamily: Fonts.display,
    fontWeight: '300',
    fontSize: Fonts.sizes.h1,
    lineHeight: Fonts.sizes.h1 * Fonts.lineHeights.tight,
    color: Colors.text,
    textAlign: 'center',
    maxWidth: Spacing.maxWidthH1,
  },
  caption: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.caption,
    color: Colors.textDim,
    marginTop: 8,
  },
  batteriesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 24,
    marginTop: 35.2,
  },
  batteryOption: {
    alignItems: 'center',
    gap: 11.2,
  },
  batteryTip: {
    width: Spacing.batteryTipWidth,   // 12dp
    height: Spacing.batteryTipHeight, // 4dp
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    backgroundColor: Colors.border,
  },
  batteryTipSelected: {
    backgroundColor: Colors.ember,
  },
  batteryBody: {
    width: Spacing.batteryBodyWidth,  // 40dp
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  batteryBodySelected: {
    borderColor: Colors.ember,
    shadowColor: Colors.ember,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  batteryFill: {
    width: '100%',
    backgroundColor: Colors.ember,
    opacity: 0.22,
  },
  batteryFillSelected: {
    opacity: 1,
  },
  batteryLabel: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.label,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(Fonts.sizes.label, Fonts.letterSpacing.wide),
    textTransform: 'lowercase',
    textAlign: 'center',
    lineHeight: Fonts.sizes.label * 1.45,
  },
  batteryLabelSelected: {
    color: Colors.ember,
  },
  button: {
    marginTop: 32,
    paddingVertical: 12.48,
    paddingHorizontal: 27.2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
  },
  buttonDisabled: {
    opacity: 0.32,
  },
  buttonText: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.button,
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(Fonts.sizes.button, Fonts.letterSpacing.button),
    textTransform: 'lowercase',
  },
  buttonTextDisabled: {
    color: Colors.textDim,
  },
});