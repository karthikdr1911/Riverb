// Safety Screen
// Always functional - shown when crisis detected

import React from 'react';
import { Text, StyleSheet, Pressable, View, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../src/components/ScreenWrapper';
import { Colors } from '../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../src/constants/Fonts';

export default function SafetyScreen() {
  const router = useRouter();

  const handleCall988 = () => {
    Linking.openURL('tel:988');
  };

  const handleTextCrisisLine = () => {
    Linking.openURL('sms:741741&body=HOME');
  };

  return (
    <ScreenWrapper showGlow={true} centered={true} scrollable={false}>
      <View style={styles.container}>
        {/* Heart symbol */}
        <Text style={styles.heart}>♡</Text>
        
        {/* Compassionate message */}
        <Text style={styles.compassion}>
          It sounds like you're going{"\n"}
          through something heavy{"\n"}
          right now.
        </Text>
        
        {/* Crisis resources */}
        <View style={styles.resources}>
          <Pressable onPress={handleCall988} style={styles.resourceItem}>
            <Text style={styles.resourceTitle}>988 Suicide & Crisis Lifeline</Text>
            <Text style={styles.resourceAction}>call or text 988</Text>
          </Pressable>
          
          <Pressable onPress={handleTextCrisisLine} style={styles.resourceItem}>
            <Text style={styles.resourceTitle}>Crisis Text Line</Text>
            <Text style={styles.resourceAction}>text HOME to 741741</Text>
          </Pressable>
        </View>
        
        {/* Entry saved notice */}
        <Text style={styles.notice}>
          your entry is saved.{"\n"}
          no mirror moment was generated.
        </Text>
        
        {/* Action buttons */}
        <Pressable
          style={styles.button}
          onPress={() => router.push('/(onboarding)/first-prompt')}
        >
          <Text style={styles.buttonText}>record another entry</Text>
        </Pressable>
        
        <Pressable
          style={styles.ghostButton}
          onPress={() => router.back()}
        >
          <Text style={styles.ghostButtonText}>close</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  heart: {
    fontSize: 48,
    color: Colors.ember,  // #D4A574
    marginBottom: 24,
  },
  compassion: {
    fontFamily: Fonts.displayItalic,
    fontSize: 17.6,  // 1.1rem
    fontStyle: 'italic',
    color: Colors.text,  // #E8E8E8
    textAlign: 'center',
    lineHeight: 17.6 * 1.65,
    marginBottom: 32,
  },
  resources: {
    width: '100%',
    maxWidth: 280,
    gap: 20,
    marginBottom: 32,
  },
  resourceItem: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
  },
  resourceTitle: {
    fontFamily: Fonts.ui,
    fontSize: 13.44,  // 0.84rem
    color: Colors.text,
    marginBottom: 6,
  },
  resourceAction: {
    fontFamily: Fonts.ui,
    fontSize: 11.2,
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(11.2, 0.08),
  },
  notice: {
    fontFamily: Fonts.displayItalic,
    fontSize: 12.8,
    fontStyle: 'italic',
    color: Colors.textDim,
    textAlign: 'center',
    lineHeight: 12.8 * 1.65,
    marginBottom: 28,
  },
  button: {
    paddingVertical: 12.48,
    paddingHorizontal: 27.2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
    marginBottom: 12,
  },
  buttonText: {
    fontFamily: Fonts.ui,
    fontSize: 11.2,
    color: Colors.textMuted,
    letterSpacing: getLetterSpacing(11.2, 0.13),
    textTransform: 'lowercase',
  },
  ghostButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  ghostButtonText: {
    fontFamily: Fonts.ui,
    fontSize: 10.4,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(10.4, 0.08),
    textTransform: 'lowercase',
  },
});