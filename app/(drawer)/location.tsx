import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
    } catch (error) {
      setErrorMsg('Failed to fetch location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (location) {
      const textToCopy = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;
      await Clipboard.setStringAsync(textToCopy);
      Alert.alert('Success', 'Location copied to clipboard!');
    }
  };

  const openInMaps = () => {
    if (location) {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Could not open maps application.');
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      <Text style={[styles.header, { color: activeColors.text }]}>Current Location</Text>

      <View style={[styles.card, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: activeColors.surfaceElevated }]}>
          <Ionicons name="location-sharp" size={40} color={activeColors.primary} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={activeColors.primary} style={styles.loader} />
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : location ? (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Ionicons name="compass-outline" size={18} color={activeColors.muted} style={styles.labelIcon} />
                <Text style={[styles.detailLabel, { color: activeColors.muted }]}>Latitude</Text>
              </View>
              <Text style={[styles.detailValue, { color: activeColors.text, fontFamily: Fonts.mono }]}>{location.coords.latitude.toFixed(6)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: activeColors.border }]} />
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Ionicons name="navigate-outline" size={18} color={activeColors.muted} style={styles.labelIcon} />
                <Text style={[styles.detailLabel, { color: activeColors.muted }]}>Longitude</Text>
              </View>
              <Text style={[styles.detailValue, { color: activeColors.text, fontFamily: Fonts.mono }]}>{location.coords.longitude.toFixed(6)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: activeColors.border }]} />
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Ionicons name="locate-outline" size={18} color={activeColors.muted} style={styles.labelIcon} />
                <Text style={[styles.detailLabel, { color: activeColors.muted }]}>Accuracy</Text>
              </View>
              <Text style={[styles.detailValue, { color: activeColors.text, fontFamily: Fonts.mono }]}>± {location.coords.accuracy?.toFixed(2)}m</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>No location data available.</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.rowButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: activeColors.primary, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={fetchLocation}
            disabled={loading}
          >
            <Ionicons name="refresh" size={20} color={activeColors.onPrimary} />
            <Text style={[styles.buttonText, { color: activeColors.onPrimary }]}>Refresh</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.buttonSecondary,
              { borderColor: activeColors.border, backgroundColor: activeColors.card, opacity: (pressed || !location) ? 0.5 : 1 }
            ]}
            onPress={copyToClipboard}
            disabled={!location || loading}
          >
            <Ionicons name="copy-outline" size={20} color={activeColors.text} />
            <Text style={[styles.buttonTextSecondary, { color: activeColors.text }]}>Copy</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.mapsButton,
            {
              backgroundColor: activeColors.surfaceElevated,
              borderColor: activeColors.border,
              opacity: (pressed || !location) ? 0.5 : 1
            }
          ]}
          onPress={openInMaps}
          disabled={!location || loading}
        >
          <Ionicons name="map" size={22} color={activeColors.text} />
          <Text style={[styles.mapsButtonText, { color: activeColors.text }]}>Open in Google Maps</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  card: {
    borderRadius: Rounded.xl,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: Rounded.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  loader: {
    marginVertical: 40,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  detailsContainer: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: Spacing.sm,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Rounded.pill,
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  buttonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Rounded.pill,
    borderWidth: 1,
    gap: 8,
  },
  buttonTextSecondary: {
    fontSize: 15,
    fontWeight: '700',
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Rounded.pill,
    borderWidth: 1,
    gap: 10,
  },
  mapsButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
