import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Upload } from 'lucide-react-native';
import { LanguageSwitcher } from '../../../../../components/LanguageSwitcher';
import { Input } from '../../../../../components/ui/Input';
import { Button } from '../../../../../components/ui/Button';
import { LANGUAGES } from '../../../../../constants/languages';
import { db, storage } from '../../../../../services/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../../../../../contexts/AuthContext';

export default function UploadScreen() {
  const { type } = useLocalSearchParams();
  const { user, isAdmin } = useAuth();
  const [selectedLanguages, setSelectedLanguages] = useState(['en']);
  const [formData, setFormData] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // Restrict access to admin users
  if (!isAdmin) {
    Alert.alert('Access Denied', 'Only admins can upload content.');
    router.back();
    return null;
  }

  const toggleLanguage = (langCode) => {
    setSelectedLanguages((prev) =>
      prev.includes(langCode)
        ? prev.filter((l) => l !== langCode)
        : [...prev, langCode]
    );
  };

  const updateFormData = (field, value, language) => {
    if (language) {
      setFormData((prev) => ({
        ...prev,
        [language]: {
          ...prev[language],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Pick and upload file to Firebase
  const handleFilePick = async (
    field,
    maxSizeMB = 100,
    allowedTypes = ['*/*']
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
      });
      if (result.canceled) return;

      const file = result.assets[0];
      if (file.size > maxSizeMB * 1024 * 1024) {
        Alert.alert('Error', `File size exceeds ${maxSizeMB}MB limit.`);
        return;
      }

      const response = await fetch(file.uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `${type}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      updateFormData(field, downloadURL);
    } catch (err) {
      console.error('File upload error:', err);
      Alert.alert('Error', 'File upload failed.');
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      if (type === 'notice') {
        if (!formData.title || !formData.message) {
          Alert.alert('Error', 'Please provide title and message.');
          setIsUploading(false);
          return;
        }
        await addDoc(collection(db, 'notices'), {
          title: formData.title,
          message: formData.message,
          createdAt: serverTimestamp(),
          uploadedBy: user.email,
        });
      } else if (type === 'video') {
        if (!formData.videoUrl) {
          Alert.alert('Error', 'Please upload a video file.');
          setIsUploading(false);
          return;
        }
        const videoPayload = {
          title: formData.title,
          videoUrl: formData.videoUrl,
          languageCategory: formData.languageCategory || '',
          thumbnailUrl: formData.thumbnailUrl || '',
          createdAt: serverTimestamp(),
          uploadedBy: user.email,
        };
        await addDoc(collection(db, 'videos'), videoPayload);
      } else if (type === 'sermon') {
        // Fixed: Only require title, audio is optional
        if (!formData.title) {
          Alert.alert('Error', 'Please provide a title for the sermon.');
          setIsUploading(false);
          return;
        }
        const sermonPayload = {
          title: formData.title,
          content: formData.content || '',
          createdAt: serverTimestamp(),
          uploadedBy: user.email,
        };
        // Only include audioUrl if it exists
        if (formData.audioUrl) {
          sermonPayload.audioUrl = formData.audioUrl;
        }
        await addDoc(collection(db, 'sermons'), sermonPayload);
      } else if (type === 'song') {
        if (!formData.audioUrl || !formData.title) {
          Alert.alert('Error', 'Please provide title and audio file.');
          setIsUploading(false);
          return;
        }
        const songPayload = {
          title: formData.title,
          audioUrl: formData.audioUrl,
          category: formData.category,
          createdAt: serverTimestamp(),
          uploadedBy: user.email,
        };
        await addDoc(collection(db, 'songs'), songPayload);
      } else if (type === 'hymn') {
        if (!formData.en?.title) {
          Alert.alert('Error', 'Please provide title for at least English.');
          setIsUploading(false);
          return;
        }
        const hymnPayload = {
          ...formData,
          createdAt: serverTimestamp(),
          uploadedBy: user.email,
        };
        await addDoc(collection(db, 'hymns'), hymnPayload);
      }

      Alert.alert('Success', `${type} uploaded successfully!`);
      router.back();
    } catch (err) {
      console.error('Upload failed:', err);
      Alert.alert('Error', 'Failed to upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderLanguageInputs = () => (
    <View style={styles.languageSection}>
      <Text style={styles.sectionTitle}>Languages</Text>
      <View style={styles.languageGrid}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageChip,
              selectedLanguages.includes(lang.code) &&
                styles.selectedLanguageChip,
            ]}
            onPress={() => toggleLanguage(lang.code)}
          >
            <Text style={styles.languageFlag}>{lang.flag}</Text>
            <Text
              style={[
                styles.languageChipText,
                selectedLanguages.includes(lang.code) &&
                  styles.selectedLanguageChipText,
              ]}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCommonFields = () => {
    if (type === 'song') {
      return (
        <View style={styles.commonFields}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.languageGrid}>
            {['acapella', 'native', 'english'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.languageChip,
                  formData.category === cat && styles.selectedLanguageChip,
                ]}
                onPress={() => updateFormData('category', cat)}
              >
                <Text
                  style={[
                    styles.languageChipText,
                    formData.category === cat &&
                      styles.selectedLanguageChipText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.fileUpload}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleFilePick('audioUrl', 50, ['audio/*'])}
            >
              <Upload size={20} color="#1E3A8A" />
              <Text style={styles.uploadText}>Upload Audio File</Text>
            </TouchableOpacity>
            {formData.audioUrl && (
              <Text style={styles.uploadedText}>Audio uploaded</Text>
            )}
          </View>
        </View>
      );
    }

    if (type === 'notice') {
      return (
        <View style={styles.commonFields}>
          <Input
            label="Message"
            value={formData.message || ''}
            onChangeText={(value) => updateFormData('message', value)}
            multiline
            numberOfLines={4}
            placeholder="Enter notice message"
            style={styles.textArea}
          />
        </View>
      );
    }

    if (type === 'video') {
      return (
        <View style={styles.commonFields}>
          <Input
            label="Language Category"
            value={formData.languageCategory || ''}
            onChangeText={(value) => updateFormData('languageCategory', value)}
            placeholder="e.g., English, Multi-language"
          />
          <View style={styles.fileUpload}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleFilePick('thumbnailUrl', 5, ['image/*'])}
            >
              <Upload size={20} color="#1E3A8A" />
              <Text style={styles.uploadText}>Upload Thumbnail</Text>
            </TouchableOpacity>
            {formData.thumbnailUrl && (
              <Text style={styles.uploadedText}>Thumbnail uploaded</Text>
            )}
          </View>
          <View style={styles.fileUpload}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleFilePick('videoUrl', 100, ['video/*'])}
            >
              <Upload size={20} color="#1E3A8A" />
              <Text style={styles.uploadText}>Upload Video (Max 10 mins)</Text>
            </TouchableOpacity>
            <Text style={styles.uploadNote}>
              Video duration should not exceed 10 minutes.
            </Text>
            {formData.videoUrl && (
              <Text style={styles.uploadedText}>Video uploaded</Text>
            )}
          </View>
        </View>
      );
    }

    if (type === 'sermon') {
      return (
        <View style={styles.commonFields}>
          <Input
            label="Content"
            value={formData.content || ''}
            onChangeText={(value) => updateFormData('content', value)}
            multiline
            numberOfLines={6}
            placeholder="Enter sermon content (use *bold*, _italic_, - bullets, 1. numbers, [text](url) for links)"
            style={styles.textArea}
          />
          <Text style={styles.formatNote}>
            Use *text* for bold, _text_ for italic, - text for bullets, 1. text
            for numbers, [text](url) for links.
          </Text>
          <View style={styles.fileUpload}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleFilePick('audioUrl', 50, ['audio/*'])}
            >
              <Upload size={20} color="#1E3A8A" />
              <Text style={styles.uploadText}>
                Upload Audio File (Optional)
              </Text>
            </TouchableOpacity>
            <Text style={styles.uploadNote}>
              Audio file is optional. You can upload just the sermon text
              without audio.
            </Text>
            {formData.audioUrl && (
              <Text style={styles.uploadedText}>Audio uploaded</Text>
            )}
          </View>
        </View>
      );
    }

    return null;
  };

  const getTitle = () => {
    switch (type) {
      case 'notice':
        return 'Add New Notice';
      case 'sermon':
        return 'Add New Sermon';
      case 'song':
        return 'Upload New Song';
      case 'video':
        return 'Upload New Video';
      default:
        return 'Upload Content';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>{getTitle()}</Text>
        <LanguageSwitcher />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(type === 'song' ||
          type === 'video' ||
          type === 'notice' ||
          type === 'sermon') && (
          <Input
            label="Title"
            value={formData.title || ''}
            onChangeText={(value) => updateFormData('title', value)}
            placeholder="Enter title"
          />
        )}
        {type === 'hymn' && renderLanguageInputs()}
        {type !== 'hymn' && renderCommonFields()}

        <Button
          title={isUploading ? 'Uploading...' : `Upload ${type}`}
          onPress={handleSubmit}
          disabled={isUploading}
          size="large"
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { padding: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  languageSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedLanguageChip: { backgroundColor: '#EBF4FF', borderColor: '#1E3A8A' },
  languageFlag: { fontSize: 16, marginRight: 6 },
  languageChipText: { fontSize: 14, color: '#6B7280' },
  selectedLanguageChipText: { color: '#1E3A8A', fontWeight: '600' },
  languageForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  languageFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  textArea: { textAlignVertical: 'top', height: 120 },
  formatNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 8,
  },
  fileUpload: { marginTop: 8 },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF4FF',
    borderWidth: 2,
    borderColor: '#1E3A8A',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  uploadNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  uploadedText: {
    fontSize: 12,
    color: '#1E3A8A',
    marginTop: 4,
    textAlign: 'center',
  },
  commonFields: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButton: { marginTop: 20, marginBottom: 40 },
});
