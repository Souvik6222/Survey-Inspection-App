import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Image, 
  Alert, 
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isSelectMode = params.mode === 'select';
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions({ writeOnly: true });
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [captureTime, setCaptureTime] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  
  const cameraRef = useRef<CameraView>(null);
  
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const activeColors = Colors[theme];

  if (!permission) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: activeColors.background }]}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: activeColors.background }]}>
        <Ionicons name="camera-outline" size={48} color={activeColors.muted} />
        <Text style={[styles.permissionText, { color: activeColors.muted }]}>Camera access is required to capture site inspections.</Text>
        <Pressable style={[styles.grantButton, { backgroundColor: activeColors.primary }]} onPress={requestPermission}>
          <Text style={[styles.grantButtonText, { color: activeColors.onPrimary }]}>Grant Camera Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
        });
        
        if (photo?.uri) {
          setPhotoUri(photo.uri);
          const now = new Date();
          setCaptureTime(now.toLocaleTimeString() + ' on ' + now.toLocaleDateString());
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image.');
      }
    }
  };

  const handleRetake = () => {
    setPhotoUri(null);
    setCaptureTime(null);
  };

  const handleSaveToGallery = async () => {
    if (!photoUri) return;
    
    let currentPermission = mediaPermission;
    if (!currentPermission || currentPermission.status !== 'granted') {
      currentPermission = await requestMediaPermission();
    }
    
    if (currentPermission?.status === 'granted') {
      try {
        await MediaLibrary.saveToLibraryAsync(photoUri);
        Alert.alert('Saved', 'Photo saved to device gallery.');
      } catch (error) {
        Alert.alert('Error', 'Failed to save photo.');
      }
    } else {
      Alert.alert('Permission Required', 'Gallery access is needed to save images.');
    }
  };

  const toggleFacing = () => {
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  };

  // Photo Review UI
  if (photoUri) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Top bar for review */}
        <View style={styles.topControlBar}>
          <Text style={styles.reviewTitle}>Preview Capture</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.previewWrapper}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          {captureTime && (
            <View style={styles.timestampBadge}>
              <Ionicons name="time-outline" size={12} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.timestampText}>{captureTime}</Text>
            </View>
          )}
        </View>

        {/* Bottom bar for review */}
        <View style={styles.bottomControlBar}>
          <Pressable style={styles.secondaryCircleBtn} onPress={handleRetake}>
            <Ionicons name="refresh" size={20} color="#FFF" />
            <Text style={styles.buttonSubText}>Retake</Text>
          </Pressable>

          {isSelectMode ? (
            <Pressable 
              style={[styles.primaryActionBtn, { backgroundColor: activeColors.primary }]} 
              onPress={() => router.navigate({ pathname: '/new-survey', params: { photoUri } })}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={activeColors.onPrimary} style={{ marginRight: 6 }} />
              <Text style={[styles.primaryActionBtnText, { color: activeColors.onPrimary }]}>Use Photo</Text>
            </Pressable>
          ) : (
            <Pressable 
              style={[styles.primaryActionBtn, { backgroundColor: activeColors.primary }]} 
              onPress={handleSaveToGallery}
            >
              <Ionicons name="download-outline" size={20} color={activeColors.onPrimary} style={{ marginRight: 6 }} />
              <Text style={[styles.primaryActionBtnText, { color: activeColors.onPrimary }]}>Save Gallery</Text>
            </Pressable>
          )}

          <Pressable style={styles.secondaryCircleBtn} onPress={() => setPhotoUri(null)}>
            <Ionicons name="close" size={20} color="#FFF" />
            <Text style={styles.buttonSubText}>Cancel</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Camera Capture UI
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top Bar controls */}
      <View style={styles.topControlBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </Pressable>
        <Pressable onPress={toggleFlash} style={styles.iconBtn} hitSlop={12}>
          <Ionicons 
            name={flash === 'on' ? "flash" : "flash-off-outline"} 
            size={22} 
            color={flash === 'on' ? activeColors.primary : "#FFF"} 
          />
        </Pressable>
      </View>

      <View style={styles.cameraWrapper}>
        {!isReady && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={activeColors.primary} />
            <Text style={styles.loadingText}>Initializing camera...</Text>
          </View>
        )}
        <CameraView 
          style={styles.camera} 
          facing={facing} 
          flash={flash}
          ref={cameraRef}
          onCameraReady={() => setIsReady(true)}
        />
      </View>

      {/* Bottom Bar controls */}
      <View style={styles.bottomControlBar}>
        <Pressable style={styles.secondaryCircleBtn} onPress={toggleFacing}>
          <Ionicons name="camera-reverse-outline" size={22} color="#FFF" />
          <Text style={styles.buttonSubText}>Flip</Text>
        </Pressable>

        <Pressable style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureInnerCircle} />
        </Pressable>

        <View style={{ width: 60, alignItems: 'center' }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  permissionText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  grantButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Rounded.pill,
  },
  grantButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  topControlBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  iconBtn: {
    padding: 8,
  },
  reviewTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#64748B',
    marginTop: 12,
    fontSize: 14,
  },
  bottomControlBar: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  secondaryCircleBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E2329',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSubText: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
  },
  previewWrapper: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  timestampBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Rounded.sm,
  },
  timestampText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '500',
    fontFamily: Fonts.mono,
  },
  primaryActionBtn: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: Rounded.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
