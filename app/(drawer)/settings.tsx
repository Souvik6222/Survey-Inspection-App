import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];
  
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);

  const handleExportData = () => {
    Alert.alert('Export Data', 'Survey database is compiled. Export as JSON/CSV?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Export CSV', onPress: () => Alert.alert('Export Complete', 'Exported to files/inspections_export.csv') }
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Survey Data',
      'This will permanently delete all locally saved inspection records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All Data', style: 'destructive', onPress: () => Alert.alert('All local survey records cleared.') }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: activeColors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: activeColors.muted }]}>Configure client and system settings.</Text>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: activeColors.muted }]}>Preferences</Text>
        <View style={[styles.listContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={18} color={activeColors.muted} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.text }]}>Push Notifications</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ true: activeColors.primary, false: activeColors.border }} 
              thumbColor={notifications ? (theme === 'dark' ? '#000' : '#fff') : undefined}
            />
          </View>
          
          <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={18} color={activeColors.muted} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.text }]}>Location Tracking</Text>
            </View>
            <Switch 
              value={locationTracking} 
              onValueChange={setLocationTracking} 
              trackColor={{ true: activeColors.primary, false: activeColors.border }} 
              thumbColor={locationTracking ? (theme === 'dark' ? '#000' : '#fff') : undefined}
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="color-palette-outline" size={18} color={activeColors.muted} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.text }]}>System Theme</Text>
            </View>
            <Text style={[styles.valueText, { color: activeColors.muted }]}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</Text>
          </View>

        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: activeColors.muted }]}>Data</Text>
        <View style={[styles.listContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          
          <Pressable 
            style={({ pressed }) => [styles.settingRow, pressed && { backgroundColor: activeColors.surfaceElevated }]} 
            onPress={handleExportData}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={18} color={activeColors.muted} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.text }]}>Export Inspection Database</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={activeColors.muted} />
          </Pressable>

          <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

          <Pressable 
            style={({ pressed }) => [styles.settingRow, pressed && { backgroundColor: activeColors.surfaceElevated }]} 
            onPress={handleClearData}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={18} color={activeColors.danger} style={styles.icon} />
              <Text style={[styles.settingText, { color: activeColors.danger, fontWeight: '600' }]}>Clear Survey Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={activeColors.muted} />
          </Pressable>

        </View>
      </View>

      {/* Version Card */}
      <View style={styles.footer}>
        <Text style={[styles.versionLabel, { color: activeColors.muted }]}>Smart Survey & Inspection Utility</Text>
        <Text style={[styles.versionText, { color: activeColors.muted, fontFamily: Fonts.mono }]}>Version 1.0.0 (Production)</Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContainer: {
    borderRadius: Rounded.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: Spacing.sm,
  },
  settingText: {
    fontSize: 14,
    fontWeight: '400',
  },
  valueText: {
    fontSize: 13,
    fontWeight: '500',
  },
  itemDivider: {
    height: 1,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 24,
  },
  versionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 11,
    marginTop: 2,
  },
});
