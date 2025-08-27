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
    quizresources: 'QuizResources',

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
    quizresources: 'Idanwo',

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
    quiz: 'Quiz',

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
  ak: {
    // Navigation
    home: 'Fie',
    hymns: 'Nnwom',
    sermons: 'Asubɔ',
    songs: 'Nnwom',
    animations: 'Nkyerɛkyerɛmu',
    profile: 'Wo ho nsɛm',
    music: 'Nnwom',
    contact: 'Nkɔmmɔbɔ',
    about: 'Yɛn ho asɛm',
    admin: 'Ɔhwɛfoɔ',
    notices: 'Akaakyerɛ',
    quizresources: 'Nsɛmmisa',

    // Common
    search: 'Hwehwɛ',
    play: 'Bɔ',
    pause: 'Sɔ',
    loading: 'Ɛde rekɔ so...',
    error: 'Mfomsoɔ',
    save: 'Gyina',
    cancel: 'Twa mu',
    submit: 'Ma me',
    login: 'Kɔ mu',
    signup: 'Kyerɛw wo din',
    logout: 'Fi mu',
    email: 'Email',
    password: 'Akyɛwadeɛ',
    name: 'Din',
    message: 'Asɛmpɛ',
    noSermons: 'Asubɔ biara nni hɔ',
    noSongs: 'Nnwom biara nni hɔ',
    noVideos: 'Video biara nni hɔ',
    noContent: 'Biribiara nni hɔ',
    unknownDuration: 'Ɛde bɛyɛɛ me',
    unknownStyle: 'Ɔkwan biara nni hɔ',

    // Onboarding
    welcome: 'Akwaaba ba Haven',
    welcomeDesc: 'Wo honhom mu kwan firi ha na ɛfiri nneɛma a ɛwɔ mu.',
    featuresTitle: 'Nneɛma a ɛwɔ mu',
    featuresDesc:
      'Wobɛtumi abɔ nnwom, asubɔ, asɛmpa, ne Bible ho nsɛm a ɛwɔ wo nsa so.',
    languagesTitle: 'Kasa ahorow pii',
    languagesDesc:
      'Wo bɛtumi abɔ nnwom wɔ English, Yoruba, Igbo, French, ne kasa afoforo 6.',
    getStarted: 'Firi aseɛ',

    // Auth
    loginTitle: 'Wo san ba',
    signupTitle: 'Join Haven',
    confirmPassword: 'Hyɛ wo nkyerɛwee',
    alreadyHaveAccount: 'Wɔwɔ akawnt?',
    dontHaveAccount: 'Wɔnni akawnt?',

    // Home
    latestSermons: 'Asubɔ a ɛyɛ foforo',
    recentMusic: 'Nnwom a ɛyɛ foforo',
    recentAnimations: 'Nkyerɛkyerɛmu a ɛyɛ foforo',

    // Content
    duration: 'Ɛde bɛyɛɛ me',
    category: 'Sɛnea ɛyɛ',
    style: 'Ɔkwan',

    // Contact
    contactUs: 'Kasa kyerɛ yɛn',
    contactDesc:
      'Yɛpɛ sɛ yɛte wo nka. Sɛ wode asɛmpɛ akyerɛ yɛn a, yɛbɛyɛ wo mmerɛ.',
    complaint: 'Amanneɛbɔ',
    suggestion: 'Akasɛm',
    request: 'Asɛmpɛ',
    selectCategory: 'Fa woho nnyinasoɔ',

    // About
    aboutUs: 'Yɛn ho asɛm',
    version: 'Nsɛm a ɛwɔ mu',
    mission: 'Yɛn nnyinasoɔ',

    // Admin
    adminDashboard: 'Ɔhwɛfoɔ a ɛwɔ mu',
    uploadContent: 'Fa nneɛma ma me',
    manageContent: 'Di nneɛma so',
    viewMessages: 'Hwɛ asɛmpɛ',
    addHymn: 'Fa nnwom ka ho',
    addSermon: 'Fa asubɔ ka ho',
    uploadSong: 'Fa nnwom ma me',
    uploadVideo: 'Fa video ma me',
  },
  zh: {
    // Navigation
    home: '主頁',
    hymns: '讚美詩',
    sermons: '佈道',
    songs: '歌曲',
    animations: '動畫',
    profile: '個人資料',
    music: '音樂',
    contact: '聯絡',
    about: '關於',
    admin: '管理員',
    notices: '公告',
    quizresources: '測驗資源',

    // Common
    search: '搜尋',
    play: '播放',
    pause: '暫停',
    loading: '載入中...',
    error: '錯誤',
    save: '儲存',
    cancel: '取消',
    submit: '提交',
    login: '登入',
    signup: '註冊',
    logout: '登出',
    email: '電子郵件',
    password: '密碼',
    name: '姓名',
    message: '訊息',
    noSermons: '沒有可用的佈道',
    noSongs: '沒有可用的歌曲',
    noVideos: '沒有可用的視頻',
    noContent: '沒有可用的內容',
    unknownDuration: '未知時長',
    unknownStyle: '未知風格',

    // Onboarding
    welcome: '歡迎來到天堂',
    welcomeDesc: '您的靈性之旅從這裡開始，提供多語言崇拜和聖經內容。',
    featuresTitle: '豐富的內容',
    featuresDesc: '以您喜歡的語言訪問讚美詩、佈道、福音音樂和聖經故事動畫。',
    languagesTitle: '多種語言',
    languagesDesc: '體驗英語、約魯巴語、伊博語、法語和另外6種語言的崇拜。',
    getStarted: '開始',

    // Auth
    loginTitle: '歡迎回來',
    signupTitle: '加入天堂',
    confirmPassword: '確認密碼',
    alreadyHaveAccount: '已有帳號？',
    dontHaveAccount: '沒有帳號？',

    // Home
    latestSermons: '最新佈道',
    recentMusic: '最新音樂',
    recentAnimations: '最新動畫',

    // Content
    duration: '時長',
    category: '類別',
    style: '風格',

    // Contact
    contactUs: '聯絡我們',
    contactDesc: '我們很高興收到您的來信。給我們發送訊息，我們會盡快回覆。',
    complaint: '投訴',
    suggestion: '建議',
    request: '請求',
    selectCategory: '選擇類別',

    // About
    aboutUs: '關於我們',
    version: '版本',
    mission: '我們的使命',

    // Admin
    adminDashboard: '管理員儀表板',
    uploadContent: '上傳內容',
    manageContent: '管理內容',
    viewMessages: '查看訊息',
    addHymn: '添加讚美詩',
    addSermon: '添加佈道',
    uploadSong: '上傳歌曲',
    uploadVideo: '上傳視頻',
  },
  zu: {
    // Navigation
    home: 'Ikhaya',
    hymns: 'Amahubo',
    sermons: 'Intshumayelo',
    songs: 'Izingoma',
    animations: 'Izithombe Ezinyakazayo',
    profile: 'Iphrofayili',
    music: 'Umculo',
    contact: 'Xhumana Nathi',
    about: 'Mayelana Nathi',
    admin: 'Umlawuli',
    notices: 'Izaziso',
    quizresources: 'Izinsiza Zokuhlola',

    // Common
    search: 'Sesha',
    play: 'Dlala',
    pause: 'Misa',
    loading: 'Iyalayisha...',
    error: 'Iphutha',
    save: 'Londoloza',
    cancel: 'Khansela',
    submit: 'Thumela',
    login: 'Ngena',
    signup: 'Bhalisa',
    logout: 'Phuma',
    email: 'I-imeyili',
    password: 'Iphasiwedi',
    name: 'Igama',
    message: 'Umlayezo',
    noSermons: 'Azikho intshumayelo etholakalayo',
    noSongs: 'Azikho izingoma etholakalayo',
    noVideos: 'Awekho amavidiyo etholakalayo',
    noContent: 'Ayikho okuqukethwe okutholakalayo',
    unknownDuration: 'Isikhathi esingaziwa',
    unknownStyle: 'Isitayela esingaziwa',

    // Onboarding
    welcome: 'Siyakwamukela e-Haven',
    welcomeDesc:
      'Uhambo lwakho olungokomoya luqala lapha ngokukhonza ngezilimi eziningi nangokuqukethwe kweBhayibheli.',
    featuresTitle: 'Okuqukethwe Okucebile',
    featuresDesc:
      'Finyelela amahubo, izintshumayelo, umculo wegospel, nezindaba zeBhayibheli ezinyakazayo ngolimi oluthandayo.',
    languagesTitle: 'Izilimi Eziningi',
    languagesDesc:
      'Zizwa ukukhonza ngesiNgisi, isiYoruba, isiIgbo, isiFulentshi, nezinye izilimi ezingu-6.',
    getStarted: 'Qala Manje',

    // Auth
    loginTitle: 'Wamukelekile',
    signupTitle: 'Joyina i-Haven',
    confirmPassword: 'Qinisekisa Iphasiwedi',
    alreadyHaveAccount: 'Usuvele unayo i-akhawunti?',
    dontHaveAccount: 'Awunayo i-akhawunti?',

    // Home
    latestSermons: 'Izintshumayelo Zamuva',
    recentMusic: 'Umculo Wakamuva',
    recentAnimations: 'Izithombe Zakamuva Ezinyakazayo',

    // Content
    duration: 'Isikhathi',
    category: 'Isigaba',
    style: 'Isitayela',

    // Contact
    contactUs: 'Xhumana Nathi',
    contactDesc:
      'Singathanda ukuzwa kuwe. Sithumele umlayezo futhi sizophendula ngokushesha okukhulu.',
    complaint: 'Isikhalazo',
    suggestion: 'Isiphakamiso',
    request: 'Isicelo',
    selectCategory: 'Khetha Isigaba',

    // About
    aboutUs: 'Mayelana Nathi',
    version: 'Inguqulo',
    mission: 'Inhloso Yethu',

    // Admin
    adminDashboard: 'Ideshibhodi Yomlawuli',
    uploadContent: 'Layisha Okuqukethwe',
    manageContent: 'Phatha Okuqukethwe',
    viewMessages: 'Buka Imilayezo',
    addHymn: 'Engeza Ihubo',
    addSermon: 'Engeza Intshumayelo',
    uploadSong: 'Layisha Ingoma',
    uploadVideo: 'Layisha Ividiyo',
  },
  sw: {
    // Navigation
    home: 'Nyumbani',
    hymns: 'Nyimbo za Kiroho',
    sermons: 'Mahubiri',
    songs: 'Nyimbo',
    animations: 'Michoro',
    profile: 'Wasifu',
    music: 'Muziki',
    contact: 'Mawasiliano',
    about: 'Kuhusu Sisi',
    admin: 'Msimamizi',
    notices: 'Matangazo',
    quizresources: 'Rasilimali za Maswali',

    // Common
    search: 'Tafuta',
    play: 'Cheza',
    pause: 'Simamisha',
    loading: 'Inapakia...',
    error: 'Kosa',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    submit: 'Tuma',
    login: 'Ingia',
    signup: 'Jisajili',
    logout: 'Toka',
    email: 'Barua pepe',
    password: 'Neno la siri',
    name: 'Jina',
    message: 'Ujumbe',
    noSermons: 'Hakuna mahubiri yanayopatikana',
    noSongs: 'Hakuna nyimbo zinazopatikana',
    noVideos: 'Hakuna video zinazopatikana',
    noContent: 'Hakuna maudhui yanayopatikana',
    unknownDuration: 'Muda usiojulikana',
    unknownStyle: 'Mtindo usiojulikana',

    // Onboarding
    welcome: 'Karibu Haven',
    welcomeDesc:
      'Safari yako ya kiroho inaanza hapa na ibada ya lugha nyingi na maudhui ya kibiblia.',
    featuresTitle: 'Maudhui Tajiri',
    featuresDesc:
      'Pata nyimbo za kiroho, mahubiri, muziki wa injili, na hadithi za Bibilia za michoro katika lugha unayopenda.',
    languagesTitle: 'Lugha Nyingi',
    languagesDesc:
      'Furahia ibada kwa Kiingereza, Kiyoruba, Kiigbo, Kifaransa, na lugha nyingine 6.',
    getStarted: 'Anza',

    // Auth
    loginTitle: 'Karibu Tena',
    signupTitle: 'Jiunge na Haven',
    confirmPassword: 'Thibitisha Neno la siri',
    alreadyHaveAccount: 'Tayari una akaunti?',
    dontHaveAccount: 'Huna akaunti?',

    // Home
    latestSermons: 'Mahubiri ya Hivi Karibuni',
    recentMusic: 'Muziki wa Hivi Karibuni',
    recentAnimations: 'Michoro ya Hivi Karibuni',

    // Content
    duration: 'Muda',
    category: 'Kategoria',
    style: 'Mtindo',

    // Contact
    contactUs: 'Wasiliana Nasi',
    contactDesc:
      'Tungependa kusikia kutoka kwako. Tutumie ujumbe na tutakujibu haraka iwezekanavyo.',
    complaint: 'Malalamiko',
    suggestion: 'Pendekezo',
    request: 'Ombi',
    selectCategory: 'Chagua Kategoria',

    // About
    aboutUs: 'Kuhusu Sisi',
    version: 'Toleo',
    mission: 'Dhamira Yetu',

    // Admin
    adminDashboard: 'Dashibodi ya Msimamizi',
    uploadContent: 'Pakia Maudhui',
    manageContent: 'Dhibiti Maudhui',
    viewMessages: 'Tazama Ujumbe',
    addHymn: 'Ongeza Wimbo wa Kiroho',
    addSermon: 'Ongeza Mahubiri',
    uploadSong: 'Pakia Wimbo',
    uploadVideo: 'Pakia Video',
  },
};

const AboutUsInfo = {
  en: {
    version: '1.0.0',
    content:
      "Haven is a multilingual church app designed to bring the gospel to people of all languages and backgrounds. Our mission is to spread God's love through hymns, sermons, music, and animated Bible stories.",
    contactEmail: 'info@higher.com.ng',
    churchMission:
      'To glorify God and make disciples of all nations through multilingual worship and biblical teaching.',
  },
  yo: {
    version: '1.0.0',
    content:
      'Haven jẹ app ijo ti o ni ede pupọ ti a ṣe apẹrẹ lati mu ihinrere wa si awọn eniyan ti gbogbo ede ati ipilẹṣẹ. Ise wa ni lati tan ifẹ Ọlọrun ka nipasẹ awọn orin iyin, iwasu, orin, ati awọn itan Bibeli ti o ni ere.',
    contactEmail: 'info@higher.com.ng',
    churchMission:
      'Lati yin Ọlọrun lógo ati lati ṣe awọn ọmọ-ẹhin ti gbogbo orilẹ-ede nipasẹ ijọsin ede pupọ ati ẹkọ Bibeli.',
  },
  fr: {
    version: '1.0.0',
    content:
      "Haven est une application d'église multilingue conçue pour apporter l'évangile aux personnes de toutes langues et origines. Notre mission est de répandre l'amour de Dieu à travers des cantiques, des sermons, de la musique et des histoires bibliques animées.",
    contactEmail: 'info@higher.com.ng',
    churchMission:
      'Glorifier Dieu et faire des disciples de toutes les nations par un culte multilingue et un enseignement biblique.',
  },
  ak: {
    version: '1.0.0',
    content:
      'Haven yɛ app a ɛwɔ kasa pii mu a wɔayɛ sɛ ɛbɛma asɛmpa aba nnipa a wɔwɔ kasa ahorow ne wɔn a wɔfiri nea wɔfiri mu. Yɛn nneyɛɛ yɛ sɛ yɛde Onyankopɔn dɔ bɛkɔ so wɔ nnwom, asubɔ, nnwom ne Bible ho nsɛm a wɔayɛ no nkanka so.',
    contactEmail: 'info@higher.com.ng',
    churchMission:
      'Sɛ yɛbɛhyɛ Onyankopɔn anuonyam na yɛayɛ nnipa a wɔfiri aman nyinaa mu nnipa sɛ ɔmɔbɔfo wɔ kasa pii mu nkwahosan ne Bible nkyerɛkyerɛ.',
  },
  zh: {
    version: '1.0.0',
    content:
      '天堂是一款多語言教會應用程式，旨在為各種語言和背景的人們帶來福音。我們的使命是通過讚美詩、佈道、音樂和聖經故事動畫傳播神的愛。',
    contactEmail: 'info@higher.com.ng',
    churchMission: '通過多語言崇拜和聖經教導，榮耀神並使萬國成為門徒。',
  },
  zu: {
    version: '1.0.0',
    content:
      'I-Haven iwuhlelo lokusebenza lwesonto olusebenzisa izilimi eziningi oluklanyelwe ukuletha ivangeli kubantu bazo zonke izilimi nezizinda. Inhloso yethu ukusabalalisa uthando lukaNkulunkulu ngamahubo, izintshumayelo, umculo, nezindaba zeBhayibheli ezinyakazayo.',
    contactEmail: 'info@higher.com.ng',
    churchMission:
      'Ukudumisa uNkulunkulu nokwenza abafundi bazo zonke izizwe ngokukhonza ngezilimi eziningi nangokufundisa kweBhayibheli.',
  },
  sw: {
    version: '1.0.0',
    content:
      'Haven ni programu ya kanisa yenye lugha nyingi iliyoundwa kuleta injili kwa watu wa lugha na asili zote. Dhamira yetu ni kueneza upendo wa Mungu kupitia nyimbo za kiroho, mahubiri, muziki, na hadithi za Biblia za michoro.',
    contactEmail: 'info@higher.com.ng',
    churchMission:
      'Kumtukuza Mungu na kufanya wanafunzi wa mataifa yote kupitia ibada ya lugha nyingi na mafundisho ya Biblia.',
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
    aboutUsInfo: AboutUsInfo[currentLanguage] || AboutUsInfo.en,
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
