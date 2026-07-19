import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { SurveyContext } from '../../context/SurveyContext';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SurveyDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { deleteSurvey } = useContext(SurveyContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  const handleCopySummary = async () => {
    const summary = `Site:\n${params.siteName}\n\nClient:\n${params.clientName}\n\nPriority:\n${params.priority}\n\nLocation:\n${params.location || 'N/A'}\n\nContact:\n${params.contact || 'N/A'}\n\nDate:\n${params.date}`;
    await Clipboard.setStringAsync(summary);
    Alert.alert('Copied!', 'Survey summary has been copied to your clipboard.');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete the survey for "${params.siteName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            if (params.id) {
              deleteSurvey(params.id as string);
              router.back();
            }
          } 
        }
      ]
    );
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
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Inspection Details</Text>
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

        {/* Inspection Details Card */}
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
          <DetailItem icon="image-outline" label="Photo Status" value={params.photo ? 'Attached' : 'No photo'} />
        </View>

        {/* Notes Card */}
        <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          <Text style={[styles.cardTitle, { color: activeColors.text }]}>Inspection Notes</Text>
          <View style={[styles.divider, { backgroundColor: activeColors.border }]} />
          <Text style={[styles.notesText, { color: params.description ? activeColors.text : activeColors.muted }]}>
            {params.description || 'No additional notes provided.'}
          </Text>
        </View>

        {/* Actions */}
        <Pressable 
          style={({ pressed }) => [
            styles.primaryBtn, 
            { backgroundColor: activeColors.primary },
            pressed && styles.pressedState
          ]} 
          onPress={handleCopySummary}
        >
          <Ionicons name="copy-outline" size={18} color={activeColors.onPrimary} style={{ marginRight: 8 }} />
          <Text style={[styles.primaryBtnText, { color: activeColors.onPrimary }]}>Copy Survey Summary</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.destructiveBtn, 
            { backgroundColor: activeColors.danger + '15', borderColor: activeColors.danger },
            pressed && styles.pressedState
          ]} 
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={18} color={activeColors.danger} style={{ marginRight: 8 }} />
          <Text style={[styles.destructiveBtnText, { color: activeColors.danger }]}>Delete Survey</Text>
        </Pressable>

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
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: Rounded.pill,
    marginBottom: 12,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  destructiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: Rounded.pill,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  destructiveBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressedState: {
    opacity: 0.8,
  },
});
