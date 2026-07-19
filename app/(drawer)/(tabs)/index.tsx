import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SurveyContext } from '../../context/SurveyContext';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function DashboardScreen() {
  const { surveys } = useContext(SurveyContext);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  // Get current date formatted like "Monday, Oct 24"
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: activeColors.muted }]}>Welcome back</Text>
            <Text style={[styles.userName, { color: activeColors.text }]}>Atul Singh</Text>
            <Text style={[styles.dateText, { color: activeColors.muted }]}>{currentDate}</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: activeColors.primary }]}>
            <Text style={[styles.avatarText, { color: activeColors.onPrimary }]}>AS</Text>
          </View>
        </View>

        {/* Today's Overview */}
        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>{"Today's Overview"}</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <View style={[styles.statIconContainer, { backgroundColor: activeColors.success + '15' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={activeColors.success} />
            </View>
            <Text style={[styles.statNumber, { color: activeColors.text }]}>{surveys.length}</Text>
            <Text style={[styles.statLabel, { color: activeColors.muted }]}>Completed</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <View style={[styles.statIconContainer, { backgroundColor: activeColors.warning + '15' }]}>
              <Ionicons name="time-outline" size={20} color={activeColors.warning} />
            </View>
            <Text style={[styles.statNumber, { color: activeColors.text }]}>4</Text>
            <Text style={[styles.statLabel, { color: activeColors.muted }]}>Pending</Text>
          </View>
        </View>

        {/* Primary Action */}
        <Pressable
          style={({ pressed }) => [
            styles.primaryActionBtn,
            { backgroundColor: activeColors.primary },
            pressed && styles.pressedState
          ]}
          onPress={() => router.push('/new-survey')}
        >
          <Ionicons name="play-outline" size={18} color={activeColors.onPrimary} style={styles.btnIcon} />
          <Text style={[styles.primaryActionBtnText, { color: activeColors.onPrimary }]}>Continue Inspection</Text>
        </Pressable>

        {/* Recent Activity (More Important) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: activeColors.text, marginBottom: 0 }]}>Recent Surveys</Text>
          <Pressable onPress={() => router.push('/history')}>
            <Text style={[styles.seeAllText, { color: activeColors.primary }]}>See all</Text>
          </Pressable>
        </View>

        <View style={[styles.listContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
          {surveys.slice(0, 3).map((survey, index) => {
            const getPriorityColor = (priority: string) => {
              switch (priority) {
                case 'High': return activeColors.danger;
                case 'Medium': return activeColors.warning;
                case 'Low': return activeColors.success;
                default: return activeColors.icon;
              }
            };
            return (
              <React.Fragment key={survey.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.surveyItem,
                    pressed && { backgroundColor: activeColors.surfaceElevated }
                  ]}
                  onPress={() => router.push({ pathname: '/survey-details', params: { ...survey } })}
                >
                  <View style={[styles.surveyIcon, { backgroundColor: getPriorityColor(survey.priority) + '15' }]}>
                    <Ionicons name="business-outline" size={18} color={getPriorityColor(survey.priority)} />
                  </View>
                  <View style={styles.surveyMeta}>
                    <Text style={[styles.surveyTitleText, { color: activeColors.text }]} numberOfLines={1}>
                      {survey.siteName}
                    </Text>
                    <Text style={[styles.surveySubText, { color: activeColors.muted }]} numberOfLines={1}>
                      Client: {survey.clientName}
                    </Text>
                  </View>
                  <View style={styles.surveyRight}>
                    <Text style={[styles.surveyDateText, { color: activeColors.muted }]}>{survey.date.split(' ')[0]}</Text>
                    <Ionicons name="chevron-forward" size={16} color={activeColors.muted} />
                  </View>
                </Pressable>
                {index < Math.min(surveys.length, 3) - 1 && (
                  <View style={[styles.itemDivider, { backgroundColor: activeColors.border }]} />
                )}
              </React.Fragment>
            );
          })}
          {surveys.length === 0 && (
            <View style={styles.emptyRecent}>
              <Text style={[styles.emptyRecentText, { color: activeColors.muted }]}>No surveys completed today.</Text>
            </View>
          )}
        </View>

        {/* Quick Actions (Less Dominant) */}
        <Text style={[styles.sectionTitle, { color: activeColors.text, marginTop: Spacing.lg }]}>Quick Tools</Text>
        <View style={styles.quickToolsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.quickToolBtn,
              { backgroundColor: activeColors.card, borderColor: activeColors.border },
              pressed && { backgroundColor: activeColors.surfaceElevated }
            ]}
            onPress={() => router.push('/camera')}
          >
            <Ionicons name="camera-outline" size={18} color={activeColors.text} />
            <Text style={[styles.quickToolLabel, { color: activeColors.text }]}>Camera</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickToolBtn,
              { backgroundColor: activeColors.card, borderColor: activeColors.border },
              pressed && { backgroundColor: activeColors.surfaceElevated }
            ]}
            onPress={() => router.push('/contacts')}
          >
            <Ionicons name="people-outline" size={18} color={activeColors.text} />
            <Text style={[styles.quickToolLabel, { color: activeColors.text }]}>Contacts</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.quickToolBtn,
              { backgroundColor: activeColors.card, borderColor: activeColors.border },
              pressed && { backgroundColor: activeColors.surfaceElevated }
            ]}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={18} color={activeColors.text} />
            <Text style={[styles.quickToolLabel, { color: activeColors.text }]}>Settings</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Rounded.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Rounded.xl,
    borderWidth: 1,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: Rounded.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  statNumber: {
    fontFamily: Fonts.mono,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  primaryActionBtn: {
    height: 48,
    borderRadius: Rounded.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  btnIcon: {
    marginRight: Spacing.xs,
  },
  pressedState: {
    opacity: 0.8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    borderRadius: Rounded.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  surveyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  surveyIcon: {
    width: 36,
    height: 36,
    borderRadius: Rounded.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  surveyMeta: {
    flex: 1,
  },
  surveyTitleText: {
    fontSize: 15,
    fontWeight: '600',
  },
  surveySubText: {
    fontSize: 12,
    marginTop: 2,
  },
  surveyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  surveyDateText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  itemDivider: {
    height: 1,
  },
  emptyRecent: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRecentText: {
    fontSize: 14,
  },
  quickToolsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  quickToolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
    height: 44,
    borderRadius: Rounded.lg,
    borderWidth: 1,
  },
  quickToolLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});

