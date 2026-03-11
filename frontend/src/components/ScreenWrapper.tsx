// ScreenWrapper Component
// Base container for all onboarding screens with:
// - Ambient glow (structural, on every screen)
// - Safe area handling
// - Centered content layout
// - Dark surface background

import React, { ReactNode } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { AmbientGlow } from './AmbientGlow';

interface ScreenWrapperProps {
  children: ReactNode;
  showGlow?: boolean;        // Show ambient glow (default true)
  scrollable?: boolean;       // Enable scrolling (default true)
  centered?: boolean;         // Center content vertically (default true)
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  showGlow = true,
  scrollable = true,
  centered = true,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      paddingTop: Spacing.screenPaddingTop + insets.top,
      paddingBottom: Spacing.screenPaddingBottom + insets.bottom,
      paddingHorizontal: Spacing.screenPaddingHorizontal,
    },
    centered && styles.centered,
  ];

  const content = (
    <View style={styles.wrapper}>
      {/* Ambient glow - structural, appears on every screen */}
      {showGlow && <AmbientGlow />}
      
      {/* Content layer */}
      <View style={styles.contentLayer}>
        {scrollable ? (
          <ScrollView
            contentContainerStyle={containerStyle}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={containerStyle}>
            {children}
          </View>
        )}
      </View>
    </View>
  );

  // Wrap in KeyboardAvoidingView for forms
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.surface,  // #131313
  },
  contentLayer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
  },
});
