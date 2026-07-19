import React, { useContext } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { SurveyContext } from '../../context/SurveyContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];
  const { surveys } = useContext(SurveyContext);
  const router = useRouter();

  // Get surveys completed this month (simulated as the count of all surveys)
  const completedThisMonth = surveys.length;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => Alert.alert('Logged out successfully.') }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      
      {/* Header section with avatar */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: activeColors.primary }]}>
          <Text style={[styles.avatarText, { color: activeColors.onPrimary }]}>SB</Text>
        </View>
        <Text style={[styles.name, { color: activeColors.text }]}>Souvik Biswas</Text>
        <Text style={[styles.role, { color: activeColors.muted }]}>Senior Field Inspector</Text>
      </View>

      {/* Statistics */}
      <View style={[styles.statsCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: activeColors.text }]}>{surveys.length}</Text>
          <Text style={[styles.statLabel, { color: activeColors.muted }]}>Completed</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: activeColors.border }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: activeColors.text }]}>4</Text>
          <Text style={[styles.statLabel, { color: activeColors.muted }]}>Pending</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: activeColors.border }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: activeColors.text }]}>{completedThisMonth}</Text>
          <Text style={[styles.statLabel, { color: activeColors.muted }]}>This Month</Text>
        </View>
      </View>

      {/* Settings list (Native style) */}
      <View style={[styles.listContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
        <Pressable 
          style={({ pressed }) => [styles.listItem, pressed && { backgroundColor: activeColors.surfaceElevated }]}
          onPress={() => Alert.alert('Account Details', 'STU-2023-001 | Field Surveying 101')}
        >
          <Ionicons name="person-outline" size={18} color={activeColors.muted} style={styles.listIcon} />
          <Text style={[styles.listItemText, { color: activeColors.text }]}>Account Details</Text>
          <Ionicons name="chevron-forward" size={16} color={activeColors.muted} />
        </Pressable>
        
        <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

        <Pressable 
          style={({ pressed }) => [styles.listItem, pressed && { backgroundColor: activeColors.surfaceElevated }]}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="notifications-outline" size={18} color={activeColors.muted} style={styles.listIcon} />
          <Text style={[styles.listItemText, { color: activeColors.text }]}>Notifications & Preferences</Text>
          <Ionicons name="chevron-forward" size={16} color={activeColors.muted} />
        </Pressable>

        <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

        <Pressable 
          style={({ pressed }) => [styles.listItem, pressed && { backgroundColor: activeColors.surfaceElevated }]}
          onPress={() => Alert.alert('Help & Support', 'Support team is contactable at support@surveyapp.com')}
        >
          <Ionicons name="help-circle-outline" size={18} color={activeColors.muted} style={styles.listIcon} />
          <Text style={[styles.listItemText, { color: activeColors.text }]}>Help Center</Text>
          <Ionicons name="chevron-forward" size={16} color={activeColors.muted} />
        </Pressable>

        <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

        <Pressable 
          style={({ pressed }) => [styles.listItem, pressed && { backgroundColor: activeColors.surfaceElevated }]}
          onPress={() => Alert.alert('About', 'Smart Field Survey & Inspection App v1.0.0')}
        >
          <Ionicons name="information-circle-outline" size={18} color={activeColors.muted} style={styles.listIcon} />
          <Text style={[styles.listItemText, { color: activeColors.text }]}>About</Text>
          <Ionicons name="chevron-forward" size={16} color={activeColors.muted} />
        </Pressable>

        <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />

        <Pressable 
          style={({ pressed }) => [styles.listItem, pressed && { backgroundColor: activeColors.surfaceElevated }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={activeColors.danger} style={styles.listIcon} />
          <Text style={[styles.listItemText, { color: activeColors.danger, fontWeight: '600' }]}>Log Out</Text>
          <Ionicons name="chevron-forward" size={16} color={activeColors.muted} />
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Rounded.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
  },
  role: {
    fontSize: 13,
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: Rounded.xl,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: Fonts.mono,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  listContainer: {
    borderRadius: Rounded.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  listIcon: {
    marginRight: Spacing.sm,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
  },
  itemDivider: {
    height: 1,
  },
});
