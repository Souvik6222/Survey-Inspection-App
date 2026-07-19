import React, { useContext, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  Pressable, 
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SurveyContext, Survey } from '../../context/SurveyContext';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HistoryScreen() {
  const { surveys, deleteSurvey } = useContext(SurveyContext);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // All, Low, Medium, High

  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      const matchesSearch = 
        survey.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        survey.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = activeFilter === 'All' || survey.priority === activeFilter;

      return matchesSearch && matchesPriority;
    });
  }, [surveys, searchQuery, activeFilter]);

  const handleDelete = (id: string, siteName: string) => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete the survey for "${siteName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteSurvey(id) 
        }
      ]
    );
  };

  const renderSurveyItem = ({ item }: { item: Survey }) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'High': return activeColors.danger;
        case 'Medium': return activeColors.warning;
        case 'Low': return activeColors.success;
        default: return activeColors.icon;
      }
    };

    return (
      <Pressable 
        style={({ pressed }) => [
          styles.card, 
          { backgroundColor: activeColors.card, borderColor: activeColors.border },
          pressed && { backgroundColor: activeColors.surfaceElevated }
        ]}
        onPress={() => router.push({ pathname: '/survey-details', params: { ...item } })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerMain}>
            <Text style={[styles.siteName, { color: activeColors.text }]} numberOfLines={1}>
              {item.siteName}
            </Text>
            <Text style={[styles.clientName, { color: activeColors.muted }]} numberOfLines={1}>
              Client: {item.clientName}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '15' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority}
            </Text>
          </View>
        </View>

        <View style={[styles.cardDivider, { backgroundColor: activeColors.border }]} />

        <View style={styles.cardFooter}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color={activeColors.muted} style={{ marginRight: 4 }} />
            <Text style={[styles.metaText, { color: activeColors.muted, fontFamily: Fonts.mono }]}>{item.date}</Text>
          </View>

          <View style={styles.rightActions}>
            <View style={styles.attachmentIcons}>
              {item.photo && <Ionicons name="camera-outline" size={16} color={activeColors.primary} style={styles.attachmentIcon} />}
              {item.location && <Ionicons name="location-outline" size={16} color={activeColors.primary} style={styles.attachmentIcon} />}
              {item.contact && <Ionicons name="person-outline" size={16} color={activeColors.primary} style={styles.attachmentIcon} />}
            </View>
            <Pressable 
              style={styles.deleteButton} 
              onPress={() => handleDelete(item.id, item.siteName)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color={activeColors.danger} />
            </Pressable>
            <Ionicons name="chevron-forward" size={16} color={activeColors.muted} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </Pressable>
    );
  };

  const filters = ['All', 'High', 'Medium', 'Low'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: activeColors.text }]}>Survey History</Text>
        <Text style={[styles.subtitle, { color: activeColors.muted }]}>Review and manage your past inspections.</Text>
      </View>

      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
        <Ionicons name="search-outline" size={18} color={activeColors.muted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: activeColors.text }]}
          placeholder="Search by site or client..."
          placeholderTextColor={activeColors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={activeColors.muted} />
          </Pressable>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                style={[
                  styles.filterChip,
                  { borderColor: activeColors.border, backgroundColor: activeColors.card },
                  isActive && { backgroundColor: activeColors.primary, borderColor: activeColors.primary }
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  { color: activeColors.text },
                  isActive && { color: activeColors.onPrimary, fontWeight: '600' }
                ]}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredSurveys}
        keyExtractor={(item) => item.id}
        renderItem={renderSurveyItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBg, { backgroundColor: activeColors.surfaceElevated }]}>
              <Ionicons name="document-text-outline" size={32} color={activeColors.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: activeColors.text }]}>No surveys found</Text>
            <Text style={[styles.emptySubtitle, { color: activeColors.muted }]}>Start your first on-site inspection report.</Text>
            
            <Pressable
              style={({ pressed }) => [
                styles.emptyActionBtn,
                { backgroundColor: activeColors.primary },
                pressed && { opacity: 0.8 }
              ]}
              onPress={() => router.push('/new-survey')}
            >
              <Ionicons name="add" size={18} color={activeColors.onPrimary} style={{ marginRight: 6 }} />
              <Text style={[styles.emptyActionBtnText, { color: activeColors.onPrimary }]}>New Survey</Text>
            </Pressable>
          </View>
        )}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: Rounded.md,
    borderWidth: 1,
    marginVertical: Spacing.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  filterContainer: {
    height: 38,
    marginBottom: Spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Rounded.pill,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  card: {
    borderRadius: Rounded.xl,
    padding: 14,
    marginBottom: Spacing.xs,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerMain: {
    flex: 1,
    marginRight: 12,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
  },
  clientName: {
    fontSize: 13,
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Rounded.sm,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: Spacing.xxs,
  },
  attachmentIcon: {
    opacity: 0.85,
  },
  deleteButton: {
    padding: 4,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: Rounded.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyActionBtn: {
    height: 40,
    borderRadius: Rounded.pill,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
