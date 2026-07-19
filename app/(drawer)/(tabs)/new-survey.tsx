import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as LocationApi from 'expo-location';
import { SurveyContext } from '../../context/SurveyContext';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function NewSurveyScreen() {
  const { addSurvey } = useContext(SurveyContext);
  const router = useRouter();
  const params = useGlobalSearchParams();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium'); // Low, Medium, High
  const [surveyDate, setSurveyDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [photoUri, setPhotoUri] = useState('');

  // Validation state
  const [siteNameError, setSiteNameError] = useState(false);
  const [clientNameError, setClientNameError] = useState(false);

  React.useEffect(() => {
    if (params.photoUri) {
      setPhotoUri(params.photoUri as string);
      router.setParams({ photoUri: '' });
    }
    if (params.selectedContact) {
      setContact(params.selectedContact as string);
      router.setParams({ selectedContact: '' });
    }
    if (params.selectedClient) {
      setClientName(params.selectedClient as string);
      setClientNameError(false);
      router.setParams({ selectedClient: '' });
    }
  }, [params.photoUri, params.selectedContact, params.selectedClient]);

  const handleGetLocation = async () => {
    try {
      let { status } = await LocationApi.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
      const loc = await LocationApi.getCurrentPositionAsync({});
      const coordsStr = `${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`;
      setLocation(coordsStr);
    } catch (e) {
      Alert.alert('Error', 'Failed to get location.');
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setSurveyDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    let hasError = false;
    if (!siteName.trim()) {
      setSiteNameError(true);
      hasError = true;
    } else {
      setSiteNameError(false);
    }
    
    if (!clientName.trim()) {
      setClientNameError(true);
      hasError = true;
    } else {
      setClientNameError(false);
    }

    if (hasError) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    const formattedDate = surveyDate.toLocaleDateString();
    const newSurvey = {
      id: Date.now().toString(),
      siteName,
      clientName,
      description,
      priority,
      date: formattedDate,
      contact,
      location,
      photo: photoUri,
    };
    
    router.push({
      pathname: '/survey-preview',
      params: newSurvey
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: activeColors.text }]}>New Survey</Text>
            <Text style={[styles.subtitle, { color: activeColors.muted }]}>Begin a new inspection report.</Text>
          </View>

          {/* Section 1: Basic Information */}
          <View style={[styles.sectionCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <Text style={[styles.sectionHeader, { color: activeColors.text }]}>Basic Information</Text>
            <View style={[styles.divider, { backgroundColor: activeColors.border }]} />

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Site Name <Text style={{ color: activeColors.danger }}>*</Text></Text>
              <View style={[styles.inputContainer, { borderColor: siteNameError ? activeColors.danger : activeColors.border, backgroundColor: activeColors.background }]}>
                <Ionicons name="business-outline" size={18} color={activeColors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: activeColors.text }]}
                  placeholder="e.g., Downtown Plaza"
                  placeholderTextColor={activeColors.muted}
                  value={siteName}
                  onChangeText={(text) => {
                    setSiteName(text);
                    if (text.trim()) setSiteNameError(false);
                  }}
                />
              </View>
              {siteNameError && <Text style={[styles.errorText, { color: activeColors.danger }]}>Site name is required</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Client Name <Text style={{ color: activeColors.danger }}>*</Text></Text>
              <View style={[styles.inputContainer, { borderColor: clientNameError ? activeColors.danger : activeColors.border, backgroundColor: activeColors.background }]}>
                <Ionicons name="person-outline" size={18} color={activeColors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: activeColors.text }]}
                  placeholder="e.g., Acme Corp"
                  placeholderTextColor={activeColors.muted}
                  value={clientName}
                  onChangeText={(text) => {
                    setClientName(text);
                    if (text.trim()) setClientNameError(false);
                  }}
                />
              </View>
              {clientNameError && <Text style={[styles.errorText, { color: activeColors.danger }]}>Client name is required</Text>}
            </View>
          </View>

          {/* Section 2: Inspection Details */}
          <View style={[styles.sectionCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <Text style={[styles.sectionHeader, { color: activeColors.text }]}>Inspection Details</Text>
            <View style={[styles.divider, { backgroundColor: activeColors.border }]} />

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Date <Text style={{ color: activeColors.danger }}>*</Text></Text>
              <Pressable 
                style={[styles.inputContainer, { borderColor: activeColors.border, backgroundColor: activeColors.background }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={18} color={activeColors.icon} style={styles.inputIcon} />
                <Text style={[styles.inputText, { color: activeColors.text, fontFamily: Fonts.mono }]}>
                  {surveyDate.toLocaleDateString()}
                </Text>
              </Pressable>

              {(showDatePicker || Platform.OS === 'ios') && (
                <View style={{ marginTop: 8, alignItems: 'flex-start' }}>
                  <DateTimePicker
                    value={surveyDate}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Priority</Text>
              <View style={styles.priorityContainer}>
                {['Low', 'Medium', 'High'].map((level) => {
                  const getLevelColor = () => {
                    if (level === 'Low') return activeColors.success;
                    if (level === 'Medium') return activeColors.warning;
                    return activeColors.danger;
                  };
                  const isActive = priority === level;
                  return (
                    <Pressable
                      key={level}
                      style={[
                        styles.priorityButton,
                        { borderColor: activeColors.border, backgroundColor: activeColors.background },
                        isActive && { borderColor: getLevelColor(), backgroundColor: getLevelColor() + '15' }
                      ]}
                      onPress={() => setPriority(level)}
                    >
                      <Text 
                        style={[
                          styles.priorityText,
                          { color: activeColors.muted },
                          isActive && { color: getLevelColor(), fontWeight: '600' }
                        ]}
                      >
                        {level}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Section 3: Attachments */}
          <View style={[styles.sectionCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <Text style={[styles.sectionHeader, { color: activeColors.text }]}>Smart Attachments</Text>
            <View style={[styles.divider, { backgroundColor: activeColors.border }]} />

            {/* Smart Action Rows */}
            {/* Photo Row */}
            <View style={[styles.actionRow, { borderBottomColor: activeColors.border }]}>
              <View style={styles.actionRowLeft}>
                {photoUri ? (
                  <View style={styles.thumbnailContainer}>
                    <Image source={{ uri: photoUri }} style={styles.thumbnail} />
                  </View>
                ) : (
                  <View style={[styles.actionIconContainer, { backgroundColor: activeColors.primary + '15' }]}>
                    <Ionicons name="camera-outline" size={18} color={activeColors.primary} />
                  </View>
                )}
                <View style={styles.actionRowTextContainer}>
                  <Text style={[styles.actionRowTitle, { color: activeColors.text }]}>Photo Attachment</Text>
                  <Text style={[styles.actionRowStatus, { color: activeColors.muted }]}>
                    {photoUri ? '✓ Photo Captured' : 'No photo attached'}
                  </Text>
                </View>
              </View>
              <View style={styles.actionRowRight}>
                {photoUri && (
                  <Pressable 
                    style={[styles.actionRowSecondaryBtn, { backgroundColor: activeColors.danger + '15' }]} 
                    onPress={() => setPhotoUri('')}
                  >
                    <Ionicons name="trash-outline" size={16} color={activeColors.danger} />
                  </Pressable>
                )}
                <Pressable 
                  style={[styles.actionRowBtn, { borderColor: activeColors.border }]}
                  onPress={() => router.push({ pathname: '/camera', params: { mode: 'select' } })}
                >
                  <Text style={[styles.actionRowBtnText, { color: activeColors.primary }]}>
                    {photoUri ? 'Retake' : 'Capture'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* GPS Row */}
            <View style={[styles.actionRow, { borderBottomColor: activeColors.border }]}>
              <View style={styles.actionRowLeft}>
                <View style={[styles.actionIconContainer, { backgroundColor: activeColors.primary + '15' }]}>
                  <Ionicons name="location-outline" size={18} color={activeColors.primary} />
                </View>
                <View style={styles.actionRowTextContainer}>
                  <Text style={[styles.actionRowTitle, { color: activeColors.text }]}>GPS Coordinates</Text>
                  <Text style={[styles.actionRowStatus, { color: activeColors.muted }]} numberOfLines={1}>
                    {location ? `✓ ${location}` : 'No coordinates set'}
                  </Text>
                </View>
              </View>
              <View style={styles.actionRowRight}>
                <Pressable 
                  style={[styles.actionRowBtn, { borderColor: activeColors.border }]}
                  onPress={handleGetLocation}
                >
                  <Text style={[styles.actionRowBtnText, { color: activeColors.primary }]}>
                    {location ? 'Refetch' : 'Get GPS'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Contacts Row */}
            <View style={[styles.actionRow, { borderBottomColor: activeColors.border }]}>
              <View style={styles.actionRowLeft}>
                <View style={[styles.actionIconContainer, { backgroundColor: activeColors.primary + '15' }]}>
                  <Ionicons name="person-outline" size={18} color={activeColors.primary} />
                </View>
                <View style={styles.actionRowTextContainer}>
                  <Text style={[styles.actionRowTitle, { color: activeColors.text }]}>Client Contact</Text>
                  <Text style={[styles.actionRowStatus, { color: activeColors.muted }]} numberOfLines={1}>
                    {contact ? `✓ ${contact}` : 'No contact details loaded'}
                  </Text>
                </View>
              </View>
              <View style={styles.actionRowRight}>
                <Pressable 
                  style={[styles.actionRowBtn, { borderColor: activeColors.border }]}
                  onPress={() => router.push({ pathname: '/contacts', params: { mode: 'select' } })}
                >
                  <Text style={[styles.actionRowBtnText, { color: activeColors.primary }]}>
                    {contact ? 'Change' : 'Select'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Manually Editable Optional Fields */}
            <View style={[styles.inputGroup, { marginTop: 16 }]}>
              <Text style={[styles.label, { color: activeColors.text }]}>Contact Number (Optional)</Text>
              <View style={[styles.inputContainer, { borderColor: activeColors.border, backgroundColor: activeColors.background }]}>
                <Ionicons name="call-outline" size={18} color={activeColors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: activeColors.text, fontFamily: Fonts.mono }]}
                  placeholder="Contact details"
                  placeholderTextColor={activeColors.muted}
                  value={contact}
                  onChangeText={setContact}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Location Coordinates (Optional)</Text>
              <View style={[styles.inputContainer, { borderColor: activeColors.border, backgroundColor: activeColors.background }]}>
                <Ionicons name="map-outline" size={18} color={activeColors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: activeColors.text, fontFamily: Fonts.mono }]}
                  placeholder="Coordinates"
                  placeholderTextColor={activeColors.muted}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>
          </View>

          {/* Section 4: Notes */}
          <View style={[styles.sectionCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
            <Text style={[styles.sectionHeader, { color: activeColors.text }]}>Additional Notes</Text>
            <View style={[styles.divider, { backgroundColor: activeColors.border }]} />

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: activeColors.text }]}>Description (Optional)</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer, { borderColor: activeColors.border, backgroundColor: activeColors.background }]}>
                <TextInput
                  style={[styles.textArea, { color: activeColors.text }]}
                  placeholder="Add any extra details here..."
                  placeholderTextColor={activeColors.muted}
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <Pressable 
            style={({ pressed }) => [
              styles.submitButton,
              { backgroundColor: activeColors.primary },
              pressed && styles.submitButtonPressed
            ]}
            onPress={handleSubmit}
          >
            <Ionicons name="eye-outline" size={18} color={activeColors.onPrimary} style={{ marginRight: 8 }} />
            <Text style={[styles.submitButtonText, { color: activeColors.onPrimary }]}>Preview Survey</Text>
          </Pressable>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
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
  sectionCard: {
    borderRadius: Rounded.xl,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Rounded.md,
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  inputText: {
    flex: 1,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  textAreaContainer: {
    height: 96,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    width: '100%',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Rounded.md,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: Rounded.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actionRowTextContainer: {
    flex: 1,
  },
  actionRowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionRowStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  actionRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionRowBtn: {
    borderWidth: 1,
    borderRadius: Rounded.md,
    paddingHorizontal: 12,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRowBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRowSecondaryBtn: {
    width: 32,
    height: 32,
    borderRadius: Rounded.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: 36,
    height: 36,
    borderRadius: Rounded.sm,
    overflow: 'hidden',
    marginRight: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  submitButton: {
    borderRadius: Rounded.pill,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  submitButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
