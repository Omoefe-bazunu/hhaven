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
import { LanguageSwitcher } from '../../../../components/LanguageSwitcher';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { LANGUAGES } from '../../../../constants/languages';

export default function UploadScreen() {
  const { type } = useLocalSearchParams();
  const [selectedLanguages, setSelectedLanguages] = useState(['en']);
  const [formData, setFormData] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const toggleLanguage = (langCode) => {
    if (selectedLanguages.includes(langCode)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== langCode));
    } else {
      setSelectedLanguages([...selectedLanguages, langCode]);
    }
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
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    // Mock upload - replace with Firebase or backend integration
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert('Success', `${type} uploaded successfully!`);
      router.back();
    }, 2000);
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

      {selectedLanguages.map((langCode) => {
        const lang = LANGUAGES.find((l) => l.code === langCode);
        return (
          <View key={langCode} style={styles.languageForm}>
            <Text style={styles.languageFormTitle}>
              {lang?.flag} {lang?.name} Content
            </Text>

            <Input
              label="Title"
              value={formData[langCode]?.title || ''}
              onChangeText={(value) => updateFormData('title', value, langCode)}
              placeholder={`Enter title in ${lang?.name}`}
            />

            {(type === 'hymn' || type === 'sermon') && (
              <Input
                label="Content"
                value={formData[langCode]?.content || ''}
                onChangeText={(value) =>
                  updateFormData('content', value, langCode)
                }
                multiline
                numberOfLines={4}
                placeholder={`Enter content in ${lang?.name}`}
                style={styles.textArea}
              />
            )}

            <View style={styles.fileUpload}>
              <TouchableOpacity style={styles.uploadButton}>
                <Upload size={20} color="#1E3A8A" />
                <Text style={styles.uploadText}>
                  Upload {type === 'video' ? 'Video' : 'Audio'} File
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderCommonFields = () => {
    if (type === 'song') {
      return (
        <View style={styles.commonFields}>
          <Input
            label="Category"
            value={formData.category || ''}
            onChangeText={(value) => updateFormData('category', value)}
            placeholder="instrumental, acappella, gospel"
          />
          <Input
            label="Style"
            value={formData.style || ''}
            onChangeText={(value) => updateFormData('style', value)}
            placeholder="e.g., Contemporary Gospel, French Gospel"
          />
          <Input
            label="Duration"
            value={formData.duration || ''}
            onChangeText={(value) => updateFormData('duration', value)}
            placeholder="e.g., 4:23"
          />
        </View>
      );
    }

    if (type === 'video') {
      return (
        <View style={styles.commonFields}>
          <Input
            label="Duration"
            value={formData.duration || ''}
            onChangeText={(value) => updateFormData('duration', value)}
            placeholder="e.g., 8:30"
          />
          <Input
            label="Language Category"
            value={formData.languageCategory || ''}
            onChangeText={(value) => updateFormData('languageCategory', value)}
            placeholder="e.g., English, Multi-language"
          />
          <View style={styles.fileUpload}>
            <TouchableOpacity style={styles.uploadButton}>
              <Upload size={20} color="#1E3A8A" />
              <Text style={styles.uploadText}>Upload Thumbnail</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (type === 'sermon') {
      return (
        <View style={styles.commonFields}>
          <Input
            label="Date"
            value={formData.date || ''}
            onChangeText={(value) => updateFormData('date', value)}
            placeholder="YYYY-MM-DD"
          />
          <Input
            label="Duration"
            value={formData.duration || ''}
            onChangeText={(value) => updateFormData('duration', value)}
            placeholder="e.g., 45:30"
          />
        </View>
      );
    }

    return null;
  };

  const getTitle = () => {
    switch (type) {
      case 'hymn':
        return 'Add New Hymn';
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
        {type === 'song' || type === 'video' ? (
          <>
            <Input
              label="Title"
              value={formData.title || ''}
              onChangeText={(value) => updateFormData('title', value)}
              placeholder="Enter title"
            />
            {renderCommonFields()}
          </>
        ) : (
          renderLanguageInputs()
        )}

        {(type === 'hymn' || type === 'sermon') && renderCommonFields()}

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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
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
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  languageSection: {
    marginBottom: 24,
  },
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
  selectedLanguageChip: {
    backgroundColor: '#EBF4FF',
    borderColor: '#1E3A8A',
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageChipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedLanguageChipText: {
    color: '#1E3A8A',
    fontWeight: '600',
  },
  languageForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  textArea: {
    textAlignVertical: 'top',
    height: 100,
  },
  fileUpload: {
    marginTop: 8,
  },
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
  commonFields: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});
