import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { SurveyContext } from '../../context/SurveyContext';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SurveyPreviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { addSurvey } = useContext(SurveyContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  const handleSubmit = () => {
    const surveyData = {
      id: params.id as string,
      siteName: params.siteName as string,
      clientName: params.clientName as string,
      description: params.description as string,
      priority: params.priority as string,
      date: params.date as string,
      contact: params.contact as string,
      location: params.location as string,
      photo: params.photo as string,
    };

    addSurvey(surveyData);
    
    Alert.alert('Success', 'Survey has been submitted successfully!', [
      { text: 'OK', onPress: () => router.push('/') }
    ]);
  };

  const handleCopySummary = async () => {
    const summary = `Site:\n${params.siteName}\n\nClient:\n${params.clientName}\n\nPriority:\n${params.priority}\n\nLocation:\n${params.location || 'N/A'}\n\nContact:\n${params.contact || 'N/A'}\n\nDate:\n${params.date}`;
    await Clipboard.setStringAsync(summary);
    Alert.alert('Copied!', 'Survey summary has been copied to your clipboard.');
  };

  const DetailItem = ({ icon, label, value }: { icon: any, label: string, value: string | undefined }) => {
    const isNumericValue = label === 'Date' || label === 'Coordinates' || label === 'Contact';
    return (
      <View style={styles.detailItem}>
        <View style={styles.detailLeft}>
          <Ionicons name={icon} size={18} color={activeColors.muted} style={styles.detailIcon} />
          <Text style={[styles.detailLabel, { color: activeColors.muted }]}>{label}</Text>
        </View>
        <Text style={[
          styles.detailValue, 
          { color: activeColors.text },
          isNumericValue && { fontFamily: Fonts.mono }
        ]}>
          {value || '—'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back-outline" size={22} color={activeColors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Review & Confirm</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* General Information Card */}
        <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          <Text style={[styles.cardTitle, { color: activeColors.text }]}>General Information</Text>
          <View style={[styles.divider, { backgroundColor: activeColors.border }]} />
          <DetailItem icon="business-outline" label="Site Name" value={params.siteName as string} />
          <DetailItem icon="person-outline" label="Client" value={params.clientName as string} />
        </View>

        {/* Inspection details Card */}
        <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          <Text style={[styles.cardTitle, { color: activeColors.text }]}>Inspection Details</Text>
          <View style={[styles.divider, { backgroundColor: activeColors.border }]} />
          <DetailItem icon="calendar-outline" label="Date" value={params.date as string} />
          <DetailItem icon="flag-outline" label="Priority" value={params.priority as string} />
        </View>

        {/* Attachments Card */}
        <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          <Text style={[styles.cardTitle, { color: activeColors.text }]}>Attachments</Text>
          <View style={[styles.divider, { backgroundColor: activeColors.border }]} />
          <DetailItem icon="call-outline" label="Contact" value={params.contact as string} />
          <DetailItem icon="location-outline" label="Coordinates" value={params.location as string} />
          <DetailItem icon="image-outline" label="Photo Attached" value={params.photo ? 'Yes (Local URI)' : 'No'} />
        </View>

        {/* Notes Card */}
        <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          <Text style={[styles.cardTitle, { color: activeColors.text }]}>Inspection Notes</Text>
          <View style={[styles.divider, { backgroundColor: activeColors.border }]} />
          <Text style={[styles.notesText, { color: params.description ? activeColors.text : activeColors.muted }]}>
            {params.description || 'No additional notes provided.'}
          </Text>
        </View>

        {/* Copy Summary (Secondary Option) */}
        <Pressable 
          style={({ pressed }) => [
            styles.copyBtn, 
            { borderColor: activeColors.border, backgroundColor: activeColors.card },
            pressed && { backgroundColor: activeColors.surfaceElevated }
          ]} 
          onPress={handleCopySummary}
        >
          <Ionicons name="copy-outline" size={16} color={activeColors.text} style={{ marginRight: 6 }} />
          <Text style={[styles.copyBtnText, { color: activeColors.text }]}>Copy Summary to Clipboard</Text>
        </Pressable>

        {/* Bottom Actions */}
        <View style={styles.actionRow}>
          <Pressable 
            style={({ pressed }) => [
              styles.editBtn, 
              { borderColor: activeColors.border, backgroundColor: activeColors.card },
              pressed && { backgroundColor: activeColors.surfaceElevated }
            ]} 
            onPress={() => router.back()}
          >
            <Text style={[styles.editBtnText, { color: activeColors.text }]}>Edit</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.submitBtn, 
              { backgroundColor: activeColors.primary },
              pressed && styles.pressedState
            ]} 
            onPress={handleSubmit}
          >
            <Text style={[styles.submitBtnText, { color: activeColors.onPrimary }]}>Submit Report</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  card: {
    borderRadius: Rounded.xl,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: Rounded.pill,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  copyBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  editBtn: {
    flex: 1,
    height: 48,
    borderRadius: Rounded.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    height: 48,
    borderRadius: Rounded.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressedState: {
    opacity: 0.8,
  },
});
