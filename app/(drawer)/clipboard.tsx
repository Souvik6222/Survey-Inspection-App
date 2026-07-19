import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SurveyContext } from '../context/SurveyContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClipboardScreen() {
  const [notes, setNotes] = useState('');
  const { surveys } = useContext(SurveyContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  const copySurveyId = async () => {
    const latestSurvey = surveys.length > 0 ? surveys[0].id : 'SRV-12345';
    await Clipboard.setStringAsync(latestSurvey);
    Alert.alert('Copied!', `Survey ID ${latestSurvey} copied to clipboard.`);
  };

  const copyContactNumber = async () => {
    const defaultNumber = '+1 (555) 123-4567';
    await Clipboard.setStringAsync(defaultNumber);
    Alert.alert('Copied!', `Contact number ${defaultNumber} copied to clipboard.`);
  };

  const copyLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const coordsStr = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
      await Clipboard.setStringAsync(coordsStr);
      Alert.alert('Copied!', `Location coordinates ${coordsStr} copied.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to get location.');
    }
  };

  const pasteNotes = async () => {
    const hasString = await Clipboard.hasStringAsync();
    if (hasString) {
      const text = await Clipboard.getStringAsync();
      setNotes((prev) => prev ? `${prev}\n${text}` : text);
      Alert.alert('Pasted!', 'Content pasted from clipboard.');
    } else {
      Alert.alert('Empty', 'No text found in clipboard.');
    }
  };

  const clearClipboard = async () => {
    await Clipboard.setStringAsync('');
    Alert.alert('Cleared!', 'Clipboard data has been cleared.');
  };

  const ActionCard = ({ title, icon, onPress, isDestructive }: any) => (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        { 
          backgroundColor: isDestructive ? activeColors.danger + '10' : activeColors.card,
          borderColor: isDestructive ? activeColors.danger : activeColors.border 
        },
        pressed && { backgroundColor: activeColors.surfaceElevated }
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color={isDestructive ? activeColors.danger : activeColors.primary} />
      <Text style={[styles.cardText, { color: isDestructive ? activeColors.danger : activeColors.text }]}>{title}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: activeColors.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.header, { color: activeColors.text }]}>Clipboard Actions</Text>
          
          <View style={styles.grid}>
            <ActionCard 
              title="Copy Survey ID" 
              icon="document-text-outline" 
              onPress={copySurveyId} 
            />
            <ActionCard 
              title="Copy Contact" 
              icon="call-outline" 
              onPress={copyContactNumber} 
            />
            <ActionCard 
              title="Copy Location" 
              icon="location-outline" 
              onPress={copyLocation} 
            />
            <ActionCard 
              title="Clear Clipboard" 
              icon="trash-outline" 
              onPress={clearClipboard} 
              isDestructive
            />
          </View>

          <View style={[styles.notesSection, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <View style={styles.notesHeader}>
              <Text style={[styles.notesTitle, { color: activeColors.text }]}>Inspection Notes</Text>
              <Pressable 
                onPress={pasteNotes} 
                style={({ pressed }) => [
                  styles.pasteButton, 
                  { backgroundColor: activeColors.surfaceElevated },
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Ionicons name="clipboard-outline" size={16} color={activeColors.primary} />
                <Text style={[styles.pasteText, { color: activeColors.text }]}>Paste</Text>
              </Pressable>
            </View>
            
            <TextInput
              style={[styles.textInput, { 
                color: activeColors.text, 
                backgroundColor: activeColors.background,
                borderColor: activeColors.border
              }]}
              multiline
              placeholder="Type or paste notes here..."
              placeholderTextColor={activeColors.muted}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  card: {
    width: '47.5%',
    padding: Spacing.md,
    borderRadius: Rounded.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 10,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  notesSection: {
    borderRadius: Rounded.xl,
    padding: Spacing.md,
    borderWidth: 1,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Rounded.pill,
  },
  pasteText: {
    fontSize: 13,
    fontWeight: '600',
  },
  textInput: {
    height: 150,
    borderRadius: Rounded.md,
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
    lineHeight: 22,
  },
});
