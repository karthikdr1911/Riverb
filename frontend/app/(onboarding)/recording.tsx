// S8 - Recording Screen
// Live timer, pulse animation, NO back button (cancel instead)

import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { ScreenWrapper } from '../../src/components/ScreenWrapper';
import { ProgressDots } from '../../src/components/ProgressDots';
import { RecordButton } from '../../src/components/RecordButton';
import { useOnboarding, FALLBACK_MIRROR_MOMENT, EntryResponse } from '../../src/contexts/OnboardingContext';
import { Colors } from '../../src/constants/Colors';
import { Fonts, getLetterSpacing } from '../../src/constants/Fonts';
import { animateScreenEntry } from '../../src/utils/animations';

const MAX_RECORDING_DURATION = 90000; // 90 seconds

const FALLBACK_ENTRY: EntryResponse = {
  entry_id: '',
  safety_mode: false,
  mirror_moment: FALLBACK_MIRROR_MOMENT,
  story_scene: null,
};

async function submitEntry(
  uri: string | null,
  userId: string,
  userName: string,
  weatherValue: number,
  energyLevel: string
): Promise<EntryResponse> {
  const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const formData = new FormData();
  if (uri) {
    formData.append('audio', { uri, type: 'audio/m4a', name: 'recording.m4a' } as any);
  }
  formData.append('user_id', userId);
  formData.append('user_name', userName);
  formData.append('weather_value', String(weatherValue));
  formData.append('energy_level', energyLevel);
  const response = await fetch(`${API_URL}/api/entries`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

export default function RecordingScreen() {
  const router = useRouter();
  const { userId, userName, weatherValue, energyLevel, setPendingEntryPromise } = useOnboarding();
  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const autoStopTimeout = useRef<NodeJS.Timeout | null>(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    animateScreenEntry(opacity, translateY);
    startRecording();

    return () => {
      // Cleanup on unmount
      if (timerInterval.current) clearInterval(timerInterval.current);
      if (autoStopTimeout.current) clearTimeout(autoStopTimeout.current);
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);

      // Start timer
      timerInterval.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      // Auto-stop at 90 seconds
      autoStopTimeout.current = setTimeout(() => {
        handleStopRecording();
      }, MAX_RECORDING_DURATION);

      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording. Continuing without audio.');
      // Navigate forward even if recording fails
      router.push('/(onboarding)/processing');
    }
  };

  const handleStopRecording = async () => {
    console.log('Stopping recording..');
    if (timerInterval.current) clearInterval(timerInterval.current);
    if (autoStopTimeout.current) clearTimeout(autoStopTimeout.current);

    // If recording never started, submit with no audio and navigate forward
    if (!recording) {
      console.log('No recording object, submitting fallback to processing');
      setPendingEntryPromise(
        submitEntry(null, userId, userName, weatherValue, energyLevel || 'medium').catch(
          () => FALLBACK_ENTRY
        )
      );
      router.push('/(onboarding)/processing');
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      console.log('[Riverb] Recording stopped, uri:', uri ? 'ok' : 'null');

      // Fire-and-forget: POST audio immediately, navigate to processing
      setPendingEntryPromise(
        submitEntry(uri, userId, userName, weatherValue, energyLevel || 'medium').catch(
          () => FALLBACK_ENTRY
        )
      );
      router.push('/(onboarding)/processing');
    } catch (err) {
      console.error('Failed to stop recording', err);
      setPendingEntryPromise(Promise.resolve(FALLBACK_ENTRY));
      router.push('/(onboarding)/processing');
    }
  };

  const handleCancel = async () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    if (autoStopTimeout.current) clearTimeout(autoStopTimeout.current);
    if (recording) {
      await recording.stopAndUnloadAsync();
    }
    setSeconds(0);
    router.back();
  };

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScreenWrapper showGlow={true} centered={true} scrollable={false}>
      {/* Cancel button instead of back */}
      <Pressable onPress={handleCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>←</Text>
      </Pressable>
      
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.question}>
          What's been on your{"\n"}
          mind lately?
        </Text>
        
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        
        <RecordButton isRecording={true} onPress={handleStopRecording} />
        
        <Text style={styles.caption}>tap to finish</Text>
      </Animated.View>
      
      <ProgressDots currentIndex={7} total={19} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    position: 'absolute',
    top: 62,
    left: 22,
    zIndex: 20,
    padding: 8,
  },
  cancelText: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.backArrow,
    color: Colors.textDim,
    letterSpacing: getLetterSpacing(Fonts.sizes.backArrow, Fonts.letterSpacing.normal),
  },
  container: {
    alignItems: 'center',
  },
  question: {
    fontFamily: Fonts.displayItalic,
    fontSize: 12.5,  // ~0.78rem
    fontStyle: 'italic',
    color: Colors.textDim,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 240,
  },
  timer: {
    fontFamily: Fonts.display,
    fontSize: Fonts.sizes.timer,  // 57.6dp (3.6rem)
    fontWeight: '300',
    color: Colors.textMuted,      // #888888
    letterSpacing: getLetterSpacing(Fonts.sizes.timer, Fonts.letterSpacing.normal),
    marginBottom: 32,
  },
  caption: {
    fontFamily: Fonts.ui,
    fontSize: Fonts.sizes.tapFinish,
    color: Colors.textDim,
    marginTop: 9.6,
    textTransform: 'lowercase',
  },
});