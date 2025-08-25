export const mockHymns = [
  {
    id: '1',
    translations: {
      en: {
        title: 'Amazing Grace',
        content:
          "Amazing grace how sweet the sound\nThat saved a wretch like me\nI once was lost, but now I'm found\nWas blind but now I see",
        audioUrl: 'https://example.com/amazing-grace-en.mp3',
      },
      yo: {
        title: 'Oore-ofe Ti O Dun',
        content:
          'Oore-ofe ti o dun to\nTi o gba eniyan bi mi\nMo ti sonu, sugbon bayi mo ri\nMo fooju, bayi mo ri',
        audioUrl: 'https://example.com/amazing-grace-yo.mp3',
      },
      fr: {
        title: 'Grâce Étonnante',
        content:
          "Grâce étonnante, que ce son est doux\nQui a sauvé un misérable comme moi\nJ'étais perdu, mais maintenant je suis trouvé\nJ'étais aveugle mais maintenant je vois",
        audioUrl: 'https://example.com/amazing-grace-fr.mp3',
      },
    },
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    translations: {
      en: {
        title: 'How Great Thou Art',
        content:
          'O Lord my God, when I in awesome wonder\nConsider all the worlds thy hands have made\nI see the stars, I hear the rolling thunder\nThy power throughout the universe displayed',
        audioUrl: 'https://example.com/how-great-thou-art-en.mp3',
      },
      yo: {
        title: 'Bi O Ti Tobi To',
        content:
          'Oluwa Olorun mi, nigbati mo ba wo\nGbogbo aiye ti owo re da\nMo ri awon irawọ, mo gbo ariwo ara\nAgbara re ni gbogbo aiye',
        audioUrl: 'https://example.com/how-great-thou-art-yo.mp3',
      },
    },
    createdAt: '2025-01-14T10:00:00Z',
  },
];

export const mockSermons = [
  {
    id: '1',
    translations: {
      en: {
        title: 'Walking in Faith',
        content:
          "Today we explore what it means to walk in faith, trusting God's plan even when we cannot see the path ahead...",
        audioUrl: 'https://example.com/walking-in-faith-en.mp3',
      },
      yo: {
        title: 'Ririn Ninu Igbagbo',
        content:
          'Loni a yoo wo kini o tumọ si lati rin ninu igbagbo, gbara Olorun gbekele paanù koda nitori a ko le ri ọna...',
        audioUrl: 'https://example.com/walking-in-faith-yo.mp3',
      },
    },
    date: '2025-01-12',
    duration: '45:30',
  },
  {
    id: '2',
    translations: {
      en: {
        title: 'The Power of Prayer',
        content:
          'Prayer is our direct line to God. Through prayer, we find strength, guidance, and peace...',
        audioUrl: 'https://example.com/power-of-prayer-en.mp3',
      },
      yo: {
        title: 'Agbara Adura',
        content:
          'Adura ni ọna wa taara si Olorun. Nipa adura, a wa agbara, itọsọna, ati alaafia...',
        audioUrl: 'https://example.com/power-of-prayer-yo.mp3',
      },
    },
    date: '2025-01-05',
    duration: '38:15',
  },
];

export const mockSongs = [
  {
    id: '1',
    title: 'Joyful Instrumental',
    category: 'instrumental',
    style: 'Contemporary Gospel',
    url: 'https://example.com/joyful-instrumental.mp3',
    duration: '4:23',
  },
  {
    id: '2',
    title: 'Hallelujah Chorus',
    category: 'acappella',
    style: 'Traditional Gospel',
    url: 'https://example.com/hallelujah-chorus.mp3',
    duration: '3:45',
  },
  {
    id: '3',
    title: 'French Worship',
    category: 'gospel',
    style: 'French Gospel',
    url: 'https://example.com/french-worship.mp3',
    duration: '5:12',
  },
];

export const mockVideos = [
  {
    id: '1',
    title: 'David and Goliath',
    duration: '8:30',
    languageCategory: 'English',
    url: 'https://example.com/david-goliath.mp4',
    thumbnailUrl:
      'https://images.pexels.com/photos/8879724/pexels-photo-8879724.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    title: "Noah's Ark",
    duration: '12:15',
    languageCategory: 'Multi-language',
    url: 'https://example.com/noahs-ark.mp4',
    thumbnailUrl:
      'https://images.pexels.com/photos/15031382/pexels-photo-15031382.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    title: 'The Good Samaritan',
    duration: '6:45',
    languageCategory: 'English',
    url: 'https://example.com/good-samaritan.mp4',
    thumbnailUrl:
      'https://images.pexels.com/photos/8879620/pexels-photo-8879620.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const mockAboutInfo = {
  version: '1.0.0',
  content:
    "Haven is a multilingual church app designed to bring the gospel to people of all languages and backgrounds. Our mission is to spread God's love through hymns, sermons, music, and animated Bible stories.",
  contactEmail: 'contact@havenchurch.com',
  churchMission:
    'To glorify God and make disciples of all nations through multilingual worship and biblical teaching.',
};
