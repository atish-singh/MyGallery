import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { saveItem } from '../storage/galleryStorage';
import { startVoice, stopVoice, useVoiceRecognition } from '../voice/voice';
import { useThemeToggle } from '../theme/ThemeContext';
import * as Clipboard from 'expo-clipboard';

export default function AddImageScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const { isDark } = useThemeToggle();
  const { isListening, transcript, error } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) setCaption(transcript);
  }, [transcript]);

  // Warn on back if there are unsaved changes
  const handleGoBack = () => {
    if (image || caption.trim().length > 0) {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Do you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ],
      );
      return;
    }
    navigation.goBack();
  };

  const pickFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant media library access');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!res.canceled && res.assets && res.assets[0]) {
        setImage(res.assets[0]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to open library');
    }
  };

  const takePhoto = async () => {
    try {
      const camPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (camPerm.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera access');
        return;
      }
      const res = await ImagePicker.launchCameraAsync({
        quality: 0.9,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!res.canceled && res.assets && res.assets[0]) {
        setImage(res.assets[0]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const save = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select or capture an image first');
      return;
    }
    try {
      await saveItem({ uri: image.uri, caption });
      Alert.alert('Success', 'Image saved successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Gallery') }
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const copyCaption = async () => {
    try {
      await Clipboard.setStringAsync(caption);
      Alert.alert('Copied', 'Caption copied to clipboard');
    } catch {}
  };

  const clearCaption = () => setCaption('');

  const bgColor = isDark ? '#1a1a1a' : '#fff';
  const textColor = isDark ? '#fff' : '#333';
  const secondaryTextColor = isDark ? '#aaa' : '#666';
  const cardBg = isDark ? '#2a2a2a' : '#f5f5f5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Add Image</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Preview */}
        <View style={[styles.imageContainer, { backgroundColor: cardBg }]}>
          {image ? (
            <>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={removeImage}
              >
                <Ionicons name="close-circle" size={32} color="#ff4444" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={80} color={secondaryTextColor} />
              <Text style={[styles.placeholderText, { color: secondaryTextColor }]}>
                No image selected
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#00BCD4' }]}
            onPress={pickFromLibrary}
          >
            <Ionicons name="images" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Choose from Library</Text>
          </TouchableOpacity>

          {Platform.OS !== 'web' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF5A5F' }]}
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Take Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Caption Section */}
        <View style={styles.captionSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Caption</Text>
          <TextInput
            placeholder="Write a caption for your image..."
            placeholderTextColor={secondaryTextColor}
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={4}
            style={[
              styles.captionInput,
              {
                backgroundColor: cardBg,
                color: textColor,
                borderColor: isDark ? '#444' : '#e0e0e0',
              },
            ]}
          />

          {/* Caption utilities */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <TouchableOpacity onPress={copyCaption} style={[styles.smallBtn, { backgroundColor: '#2563eb' }]}>
              <Ionicons name="copy" size={18} color="#fff" />
              <Text style={styles.smallBtnText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearCaption} style={[styles.smallBtn, { backgroundColor: '#6b7280' }]}>
              <Ionicons name="close" size={18} color="#fff" />
              <Text style={styles.smallBtnText}>Clear</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <Text style={{ color: secondaryTextColor, alignSelf: 'center' }}>{caption.length}/280</Text>
          </View>

          {/* Voice Input Button */}
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isListening && styles.voiceButtonActive,
              { backgroundColor: isListening ? '#ff4444' : '#7B68EE' },
            ]}
            onPress={isListening ? stopVoice : startVoice}
          >
            <Ionicons
              name={isListening ? 'stop-circle' : 'mic'}
              size={24}
              color="#fff"
            />
            <Text style={styles.voiceButtonText}>
              {isListening ? 'Stop Recording' : 'Voice Caption'}
            </Text>
            {isListening && (
              <View style={styles.pulseIndicator}>
                <View style={styles.pulse} />
              </View>
            )}
          </TouchableOpacity>

          {/* Transcript Display */}
          {transcript && (
            <View style={[styles.transcriptBox, { backgroundColor: cardBg }]}> 
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.transcriptText, { color: textColor }]}>Voice input captured</Text>
            </View>
          )}

          {/* Error Display */}
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color="#ff4444" />
              <Text style={styles.errorText}>{String(error)}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.footer, { backgroundColor: bgColor, borderTopColor: isDark ? '#333' : '#e0e0e0' }]}> 
        <TouchableOpacity
          style={[
            styles.saveButton,
            !image && styles.saveButtonDisabled,
          ]}
          onPress={save}
          disabled={!image}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Save to Gallery</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  captionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  captionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 12,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  voiceButtonActive: {
    opacity: 0.9,
  },
  voiceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pulseIndicator: {
    marginLeft: 8,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  transcriptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  transcriptText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff0f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  smallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 5,
  },
  smallBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});