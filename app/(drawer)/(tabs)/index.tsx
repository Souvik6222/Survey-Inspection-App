import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
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
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header with Glass Effect */}
        <BlurView intensity={80} tint={theme} style={styles.headerBlur}>
          <SafeAreaView edges={['top']}>
            <View style={styles.header}>
              <View>
                <Text style={[styles.welcomeText, { color: activeColors.muted }]}>Welcome back</Text>
                <Text style={[styles.userName, { color: activeColors.text }]}>Souvik Biswas</Text>
                <Text style={[styles.dateText, { color: activeColors.muted }]}>{currentDate}</Text>
              </View>
              <View style={[styles.avatar, { backgroundColor: activeColors.primary }]}>
                <Text style={[styles.avatarText, { color: activeColors.onPrimary }]}>SB</Text>
              </View>
            </View>
          </SafeAreaView>
        </BlurView>

        {/* Today's Overview */}
        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>{"Today's Overview"}</Text>
        <View style={styles.statsRow}>
          <BlurView
            intensity={60}
            tint={theme}
            style={[styles.statCard, {
              borderColor: activeColors.glassBorder,
              shadowColor: activeColors.shadow,
            }]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: activeColors.success + '20' }]}>
              <Ionicons name="checkmark-circle-outline" size={22} color={activeColors.success} />
            </View>
            <Text style={[styles.statNumber, { color: activeColors.text }]}>{surveys.length}</Text>
            <Text style={[styles.statLabel, { color: activeColors.muted }]}>Completed</Text>
          </BlurView>

          <BlurView
            intensity={60}
            tint={theme}
            style={[styles.statCard, {
              borderColor: activeColors.glassBorder,
              shadowColor: activeColors.shadow,
            }]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: activeColors.warning + '20' }]}>
              <Ionicons name="time-outline" size={22} color={activeColors.warning} />
            </View>
            <Text style={[styles.statNumber, { color: activeColors.text }]}>4</Text>
            <Text style={[styles.statLabel, { color: activeColors.muted }]}>Pending</Text>
          </BlurView>
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
          <Ionicons name="play-outline" size={20} color={activeColors.onPrimary} style={styles.btnIcon} />
          <Text style={[styles.primaryActionBtnText, { color: activeColors.onPrimary }]}>Continue Inspection</Text>
        </Pressable>

        {/* Recent Activity (More Important) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: activeColors.text, marginBottom: 0 }]}>Recent Surveys</Text>
          <Pressable onPress={() => router.push('/history')}>
            <Text style={[styles.seeAllText, { color: activeColors.primary }]}>See all</Text>
          </Pressable>
        </View>

        <BlurView
          intensity={60}
          tint={theme}
          style={[styles.listContainer, {
            borderColor: activeColors.glassBorder,
            shadowColor: activeColors.shadow,
          }]}
        >
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
                    pressed && { opacity: 0.7 }
                  ]}
                  onPress={() => router.push({ pathname: '/survey-details', params: { ...survey } })}
                >
                  <View style={[styles.surveyIcon, { backgroundColor: getPriorityColor(survey.priority) + '20' }]}>
                    <Ionicons name="business-outline" size={20} color={getPriorityColor(survey.priority)} />
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
                    <Ionicons name="chevron-forward" size={18} color={activeColors.muted} />
                  </View>
                </Pressable>
                {index < Math.min(surveys.length, 3) - 1 && (
                  <View style={[styles.itemDivider, { backgroundColor: activeColors.hairline }]} />
                )}
              </React.Fragment>
            );
          })}
          {surveys.length === 0 && (
            <View style={styles.emptyRecent}>
              <Text style={[styles.emptyRecentText, { color: activeColors.muted }]}>No surveys completed today.</Text>
            </View>
          )}
        </BlurView>

        {/* Quick Actions (Less Dominant) */}
        <Text style={[styles.sectionTitle, { color: activeColors.text, marginTop: Spacing.lg }]}>Quick Tools</Text>
        <View style={styles.quickToolsRow}>
          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }
            ]}
            onPress={() => router.push('/camera')}
          >
            <BlurView
              intensity={60}
              tint={theme}
              style={[styles.quickToolBtn, {
                borderColor: activeColors.glassBorder,
                shadowColor: activeColors.shadow,
              }]}
            >
              <Ionicons name="camera-outline" size={20} color={activeColors.text} />
              <Text style={[styles.quickToolLabel, { color: activeColors.text }]}>Camera</Text>
            </BlurView>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }
            ]}
            onPress={() => router.push('/contacts')}
          >
            <BlurView
              intensity={60}
              tint={theme}
              style={[styles.quickToolBtn, {
                borderColor: activeColors.glassBorder,
                shadowColor: activeColors.shadow,
              }]}
            >
              <Ionicons name="people-outline" size={20} color={activeColors.text} />
              <Text style={[styles.quickToolLabel, { color: activeColors.text }]}>Contacts</Text>
            </BlurView>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }
            ]}
            onPress={() => router.push('/settings')}
          >
            <BlurView
              intensity={60}
              tint={theme}
              style={[styles.quickToolBtn, {
                borderColor: activeColors.glassBorder,
                shadowColor: activeColors.shadow,
              }]}
            >
              <Ionicons name="settings-outline" size={20} color={activeColors.text} />
              <Text style={[styles.quickToolLabel, { color: activeColors.text }]}>Settings</Text>
            </BlurView>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingHorizontal: Spacing.md,
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  dateText: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Rounded.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 20,
    borderWidth: 0.5,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statNumber: {
    fontFamily: Fonts.mono,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  primaryActionBtn: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  primaryActionBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  btnIcon: {
    marginRight: Spacing.xs,
  },
  pressedState: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  listContainer: {
    borderRadius: 20,
    borderWidth: 0.5,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  surveyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  surveyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  surveyMeta: {
    flex: 1,
  },
  surveyTitleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  surveySubText: {
    fontSize: 13,
    marginTop: 3,
    fontWeight: '500',
  },
  surveyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  surveyDateText: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '500',
  },
  itemDivider: {
    height: 0.5,
    marginLeft: Spacing.md + 40 + Spacing.sm,
  },
  emptyRecent: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRecentText: {
    fontSize: 15,
    fontWeight: '500',
  },
  quickToolsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickToolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    height: 52,
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quickToolLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});

