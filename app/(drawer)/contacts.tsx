import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  RefreshControl, 
  Pressable, 
  Alert,
  ActivityIndicator
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useLocalSearchParams();
  const isSelectMode = params.mode === 'select';

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  const fetchContacts = useCallback(async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
          sort: Contacts.SortTypes.FirstName,
        });
        
        if (data.length > 0) {
          setContacts(data);
          setFilteredContacts(data);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  }, [fetchContacts]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = contacts.filter((contact) => 
        contact.name?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const copyToClipboard = async (phoneNumber: string) => {
    await Clipboard.setStringAsync(phoneNumber);
    Alert.alert('Success', 'Phone number copied to clipboard!');
  };

  const getInitial = (name: string | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const renderItem = ({ item }: { item: Contacts.Contact }) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 
      ? item.phoneNumbers[0].number 
      : null;
      
    return (
      <Pressable 
        style={({ pressed }) => [
          styles.contactCard, 
          { backgroundColor: activeColors.card, borderColor: activeColors.border },
          pressed && { backgroundColor: activeColors.surfaceElevated }
        ]}
        onPress={() => {
          if (isSelectMode) {
            router.navigate({ 
              pathname: '/new-survey', 
              params: { selectedContact: phoneNumber, selectedClient: item.name } 
            });
          } else if (phoneNumber) {
            copyToClipboard(phoneNumber);
          }
        }}
      >
        <View style={styles.contactLeft}>
          <View style={[styles.avatar, { backgroundColor: activeColors.primary }]}>
            <Text style={[styles.avatarText, { color: activeColors.onPrimary }]}>
              {getInitial(item.name)}
            </Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactName, { color: activeColors.text }]} numberOfLines={1}>
              {item.name || 'Unknown Contact'}
            </Text>
            <Text style={[styles.contactNumber, { color: activeColors.muted, fontFamily: Fonts.mono }]}>
              {phoneNumber || 'No Phone Number'}
            </Text>
          </View>
        </View>
        
        {isSelectMode ? (
          <Ionicons name="chevron-forward" size={16} color={activeColors.muted} />
        ) : (
          phoneNumber && (
            <Pressable 
              style={styles.copyButton}
              onPress={() => copyToClipboard(phoneNumber)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="copy-outline" size={18} color={activeColors.primary} />
            </Pressable>
          )
        )}
      </Pressable>
    );
  };

  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons 
          name={permissionGranted === false ? 'lock-closed-outline' : 'people-outline'} 
          size={48} 
          color={activeColors.muted} 
        />
        <Text style={[styles.emptyTitle, { color: activeColors.text }]}>
          {permissionGranted === false ? 'Permission Required' : 'No Contacts'}
        </Text>
        <Text style={[styles.emptySubtitle, { color: activeColors.muted }]}>
          {permissionGranted === false 
            ? 'Please enable contacts access in your device settings.' 
            : 'Try adjusting your search query.'}
        </Text>
        
        {permissionGranted === false && (
          <Pressable 
            style={[styles.grantBtn, { backgroundColor: activeColors.primary }]}
            onPress={fetchContacts}
          >
            <Text style={[styles.grantBtnText, { color: activeColors.onPrimary }]}>
              Request Permission
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: activeColors.text }]}>Contacts</Text>
        <Text style={[styles.subtitle, { color: activeColors.muted }]}>Select a contact to auto-fill the client details.</Text>
      </View>
      
      {/* Sticky Search bar */}
      <View style={[styles.searchContainer, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
        <Ionicons name="search-outline" size={18} color={activeColors.muted} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: activeColors.text }]}
          placeholder="Search contacts..."
          placeholderTextColor={activeColors.muted}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={activeColors.muted} />
          </Pressable>
        )}
      </View>

      <View style={styles.counterContainer}>
        <Text style={[styles.counterText, { color: activeColors.primary, fontFamily: Fonts.mono }]}>
          {filteredContacts.length} {filteredContacts.length === 1 ? 'Contact' : 'Contacts'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item, index) => (item as any).id ? (item as any).id.toString() : index.toString()}
          renderItem={renderItem}
          contentContainerStyle={filteredContacts.length === 0 ? styles.emptyListContent : styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={activeColors.primary}
              colors={[activeColors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  header: {
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
    marginBottom: Spacing.xs,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  counterContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: Rounded.xl,
    borderWidth: 1,
    marginBottom: 10,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Rounded.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactNumber: {
    fontSize: 12,
    marginTop: 2,
  },
  copyButton: {
    padding: 6,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  grantBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Rounded.pill,
  },
  grantBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
