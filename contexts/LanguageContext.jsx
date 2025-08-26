import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANGUAGE } from '../constants/languages';

const LanguageContext = createContext(undefined);

const translations = {
  en: {
    // Navigation
    home: 'Home',
    hymns: 'Hymns',
    sermons: 'Sermons',
    songs: 'Songs',
    animations: 'Animations',
    profile: 'Profile',
    music: 'Music',
    contact: 'Contact',
    about: 'About',
    admin: 'Admin',
    notices: 'Notices',

    // Common
    search: 'Search',
    play: 'Play',
    pause: 'Pause',
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    message: 'Message',
    noSermons: 'No sermons available',
    noSongs: 'No songs available',
    noVideos: 'No videos available',
    noContent: 'No content available',
    unknownDuration: 'Unknown duration',
    unknownStyle: 'Unknown style',

    // Onboarding
    welcome: 'Welcome to Haven',
    welcomeDesc:
      'Your spiritual journey begins here with multilingual worship and biblical content.',
    featuresTitle: 'Rich Content',
    featuresDesc:
      'Access hymns, sermons, gospel music, and animated Bible stories in your preferred language.',
    languagesTitle: 'Multiple Languages',
    languagesDesc:
      'Experience worship in English, Yoruba, Igbo, French, and 6 other languages.',
    getStarted: 'Get Started',

    // Auth
    loginTitle: 'Welcome Back',
    signupTitle: 'Join Haven',
    confirmPassword: 'Confirm Password',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",

    // Home
    latestSermons: 'Latest Sermons',
    recentMusic: 'Recent Music',
    recentAnimations: 'Recent Animations',

    // Content
    duration: 'Duration',
    category: 'Category',
    style: 'Style',

    // Contact
    contactUs: 'Contact Us',
    contactDesc:
      "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    complaint: 'Complaint',
    suggestion: 'Suggestion',
    request: 'Request',
    selectCategory: 'Select Category',

    // About
    aboutUs: 'About Us',
    version: 'Version',
    mission: 'Our Mission',

    // Admin
    adminDashboard: 'Admin Dashboard',
    uploadContent: 'Upload Content',
    manageContent: 'Manage Content',
    viewMessages: 'View Messages',
    addHymn: 'Add Hymn',
    addSermon: 'Add Sermon',
    uploadSong: 'Upload Song',
    uploadVideo: 'Upload Video',
  },
  yo: {
    // Navigation
    home: 'Ile',
    hymns: 'Orin Iyin',
    sermons: 'Iwasu',
    songs: 'Orin',
    animations: 'Aworan Eré',
    profile: 'Profaili',
    music: 'Orin',
    contact: 'Olubasọrọ',
    about: 'Nipa Wa',
    admin: 'Olutọju',
    notices: 'Awọn Iwifun',

    // Common
    search: 'Wa',
    play: 'Mu',
    pause: 'Duro',
    loading: 'O n gbe...',
    error: 'Aṣiṣe',
    save: 'Fi Pamọ',
    cancel: 'Fagilee',
    submit: 'Fi Silẹ',
    login: 'Wọle',
    signup: 'Forukọsilẹ',
    logout: 'Jade',
    email: 'Imeeli',
    password: 'Ọrọ Igbaniwọle',
    name: 'Orukọ',
    message: 'Ifiranṣẹ',
    noSermons: 'Ko si iwasu to wa',
    noSongs: 'Ko si orin to wa',
    noVideos: 'Ko si aworan eré to wa',
    noContent: 'Ko si akoonu to wa',
    unknownDuration: 'Idasile ti a ko mọ',
    unknownStyle: 'Ara ti a ko mọ',

    // Auth
    loginTitle: 'Kaabo Pada',
    signupTitle: 'Darapọ Mọ Haven',
    confirmPassword: 'Jẹrisi Ọrọ Igbaniwọle',
    alreadyHaveAccount: 'Ṣe o ni akaunto tẹlẹ?',
    dontHaveAccount: 'Ko ni akaunto?',

    // Home
    latestSermons: 'Iwasu Tuntun',
    recentMusic: 'Orin Tuntun',
    recentAnimations: 'Aworan Eré Tuntun',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    hymns: 'Cantiques',
    songs: 'Chansons',
    sermons: 'Sermons',
    animations: 'Animations',
    profile: 'Profil',
    music: 'Musique',
    contact: 'Contact',
    about: 'À Propos',
    admin: 'Admin',
    notices: 'Avis',

    // Common
    search: 'Rechercher',
    play: 'Jouer',
    pause: 'Pause',
    loading: 'Chargement...',
    error: 'Erreur',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    submit: 'Soumettre',
    login: 'Connexion',
    signup: "S'inscrire",
    logout: 'Déconnexion',
    email: 'Email',
    password: 'Mot de passe',
    name: 'Nom',
    message: 'Message',
    noSermons: 'Aucun sermon disponible',
    noSongs: 'Aucune chanson disponible',
    noVideos: 'Aucune animation disponible',
    noContent: 'Aucun contenu disponible',
    unknownDuration: 'Durée inconnue',
    unknownStyle: 'Style inconnu',

    // Auth
    loginTitle: 'Bon Retour',
    signupTitle: 'Rejoindre Haven',
    confirmPassword: 'Confirmer le mot de passe',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    dontHaveAccount: "Vous n'avez pas de compte?",

    // Home
    latestSermons: 'Derniers Sermons',
    recentMusic: 'Musique Récente',
    recentAnimations: 'Animations Récentes',
  },
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('preferredLanguage');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  };

  const setLanguage = async (language) => {
    try {
      await AsyncStorage.setItem('preferredLanguage', language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const value = {
    currentLanguage,
    setLanguage,
    translations: translations[currentLanguage] || translations.en,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
