import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  setDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ==========================================
// SERMONS DATA SERVICE
// ==========================================
export const getSermons = async () => {
  try {
    const sermonsRef = collection(db, 'sermons');
    const q = query(sermonsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const sermons = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sermons.push({
        id: doc.id,
        title: data.title,
        content: data.content || '',
        audioUrl: data.audioUrl || null,
        date:
          data.createdAt?.toDate()?.toISOString()?.split('T')[0] ||
          new Date().toISOString().split('T')[0],
        duration: data.duration || null,
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt,
      });
    });

    return sermons;
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return [];
  }
};

export const subscribeToSermons = (callback) => {
  const sermonsRef = collection(db, 'sermons');
  const q = query(sermonsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const sermons = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        sermons.push({
          id: doc.id,
          title: data.title,
          content: data.content || '',
          audioUrl: data.audioUrl || null,
          date:
            data.createdAt?.toDate()?.toISOString()?.split('T')[0] ||
            new Date().toISOString().split('T')[0],
          duration: data.duration || null,
          uploadedBy: data.uploadedBy,
          createdAt: data.createdAt,
        });
      });
      callback(sermons);
    },
    (error) => {
      console.error('Error listening to sermons:', error);
      callback([]);
    }
  );
};

export const getSermon = async (sermonId) => {
  try {
    const sermonRef = doc(db, 'sermons', sermonId);
    const sermonSnap = await getDoc(sermonRef);

    if (sermonSnap.exists()) {
      const data = sermonSnap.data();
      return {
        id: sermonSnap.id,
        title: data.title,
        content: data.content || '',
        audioUrl: data.audioUrl || null,
        date:
          data.createdAt?.toDate()?.toISOString()?.split('T')[0] ||
          new Date().toISOString().split('T')[0],
        duration: data.duration || null,
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching sermon:', error);
    return null;
  }
};

// ==========================================
// SONGS DATA SERVICE
// ==========================================
export const getSongs = async () => {
  try {
    const songsRef = collection(db, 'songs');
    const q = query(songsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const songs = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      songs.push({
        id: doc.id,
        title: data.title,
        category: data.category,
        audioUrl: data.audioUrl,
        duration: data.duration || null,
        style: data.style || getStyleByCategory(data.category),
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt,
      });
    });

    return songs;
  } catch (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
};

export const getSongsByCategory = async (category) => {
  try {
    const songsRef = collection(db, 'songs');
    const q = query(
      songsRef,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const songs = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      songs.push({
        id: doc.id,
        title: data.title,
        category: data.category,
        audioUrl: data.audioUrl,
        duration: data.duration || null,
        style: data.style || getStyleByCategory(data.category),
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt,
      });
    });

    return songs;
  } catch (error) {
    console.error('Error fetching songs by category:', error);
    return [];
  }
};

const getStyleByCategory = (category) => {
  switch (category) {
    case 'acapella':
      return 'A Cappella Gospel';
    case 'native':
      return 'Contemporary Gospel';
    case 'english':
      return 'English Gospel';
    default:
      return 'Gospel';
  }
};

export const subscribeToSongs = (callback) => {
  const songsRef = collection(db, 'songs');
  const q = query(songsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const songs = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        songs.push({
          id: doc.id,
          title: data.title,
          category: data.category,
          audioUrl: data.audioUrl,
          duration: data.duration || null,
          style: data.style || getStyleByCategory(data.category),
          uploadedBy: data.uploadedBy,
          createdAt: data.createdAt,
        });
      });
      callback(songs);
    },
    (error) => {
      console.error('Error listening to songs:', error);
      callback([]);
    }
  );
};

export const getSong = async (songId) => {
  try {
    const songRef = doc(db, 'songs', songId);
    const songSnap = await getDoc(songRef);

    if (songSnap.exists()) {
      const data = songSnap.data();
      return {
        id: songSnap.id,
        title: data.title,
        category: data.category,
        audioUrl: data.audioUrl,
        duration: data.duration || null,
        style: data.style || getStyleByCategory(data.category),
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching song:', error);
    return null;
  }
};

// ==========================================
// VIDEOS DATA SERVICE
// ==========================================
export const getVideos = async () => {
  try {
    const videosRef = collection(db, 'videos');
    const q = query(videosRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const videos = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title,
        duration: data.duration || null,
        languageCategory: data.languageCategory || 'Multi-language',
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || getDefaultThumbnail(),
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt,
      });
    });

    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const getVideo = async (videoId) => {
  try {
    const videoRef = doc(db, 'videos', videoId);
    const videoSnap = await getDoc(videoRef);

    if (videoSnap.exists()) {
      const data = videoSnap.data();
      return {
        id: videoSnap.id,
        title: data.title,
        duration: data.duration || null,
        languageCategory: data.languageCategory || 'Multi-language',
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || getDefaultThumbnail(),
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
};

export const subscribeToVideos = (callback) => {
  const videosRef = collection(db, 'videos');
  const q = query(videosRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const videos = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        videos.push({
          id: doc.id,
          title: data.title,
          duration: data.duration || null,
          languageCategory: data.languageCategory || 'Multi-language',
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl || getDefaultThumbnail(),
          uploadedBy: data.uploadedBy,
          createdAt: data.createdAt,
        });
      });
      callback(videos);
    },
    (error) => {
      console.error('Error listening to videos:', error);
      callback([]);
    }
  );
};

const getDefaultThumbnail = () => {
  return 'https://images.pexels.com/photos/8879724/pexels-photo-8879724.jpeg?auto=compress&cs=tinysrgb&w=800';
};

// ==========================================
// NOTICES DATA SERVICE
// ==========================================
export const getNotices = async () => {
  try {
    const noticesRef = collection(db, 'notices');
    const q = query(noticesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const notices = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notices.push({
        id: doc.id,
        title: data.title,
        message: data.message,
        date:
          data.createdAt?.toDate()?.toISOString()?.split('T')[0] ||
          new Date().toISOString().split('T')[0],
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt,
      });
    });

    return notices;
  } catch (error) {
    console.error('Error fetching notices:', error);
    return [];
  }
};

export const subscribeToNotices = (callback) => {
  const noticesRef = collection(db, 'notices');
  const q = query(noticesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const notices = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        notices.push({
          id: doc.id,
          title: data.title,
          message: data.message,
          date:
            data.createdAt?.toDate()?.toISOString()?.split('T')[0] ||
            new Date().toISOString().split('T')[0],
          uploadedBy: data.uploadedBy,
          createdAt: data.createdAt,
        });
      });
      callback(notices);
    },
    (error) => {
      console.error('Error listening to notices:', error);
      callback([]);
    }
  );
};

// New functions for tracking read notices
export const markNoticeAsRead = async (userId, noticeId) => {
  try {
    const docRef = doc(db, 'users', userId, 'readNotices', noticeId);
    await setDoc(docRef, { readAt: new Date() });
  } catch (error) {
    console.error('Error marking notice as read:', error);
  }
};

export const getReadNoticesIds = async (userId) => {
  if (!userId) {
    return [];
  }
  try {
    const readNoticesRef = collection(db, 'users', userId, 'readNotices');
    const querySnapshot = await getDocs(readNoticesRef);
    const readNoticeIds = querySnapshot.docs.map((doc) => doc.id);
    return readNoticeIds;
  } catch (error) {
    console.error('Error fetching read notice IDs:', error);
    return [];
  }
};

export const subscribeToReadNotices = (userId, callback) => {
  if (!userId) {
    callback([]);
    return () => {}; // Return a no-op unsubscribe function
  }
  const readNoticesRef = collection(db, 'users', userId, 'readNotices');
  return onSnapshot(
    readNoticesRef,
    (snapshot) => {
      const readNoticeIds = snapshot.docs.map((doc) => doc.id);
      callback(readNoticeIds);
    },
    (error) => {
      console.error('Error listening to read notices:', error);
      callback([]);
    }
  );
};

// ==========================================
// CONTACT MESSAGES DATA SERVICE
// ==========================================
export const addContactMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, 'contactMessages'), {
      ...messageData,
      createdAt: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding contact message: ', e);
    throw e;
  }
};

export const subscribeToContactMessages = (callback) => {
  const q = query(
    collection(db, 'contactMessages'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    },
    (error) => {
      console.error('Error subscribing to contact messages: ', error);
      callback([]);
    }
  );
};

// ==========================================
// GENERIC DATA FETCHERS
// ==========================================
export const getRecentContent = async () => {
  try {
    const [recentSermons, recentSongs, recentVideos] = await Promise.all([
      getDocs(
        query(collection(db, 'sermons'), orderBy('createdAt', 'desc'), limit(3))
      ),
      getDocs(
        query(collection(db, 'songs'), orderBy('createdAt', 'desc'), limit(3))
      ),
      getDocs(
        query(collection(db, 'videos'), orderBy('createdAt', 'desc'), limit(3))
      ),
    ]);

    const content = {
      sermons: [],
      songs: [],
      videos: [],
    };

    recentSermons.forEach((doc) => {
      const data = doc.data();
      content.sermons.push({
        id: doc.id,
        title: data.title,
        audioUrl: data.audioUrl || null,
        date: data.createdAt?.toDate()?.toISOString()?.split('T')[0],
      });
    });

    recentSongs.forEach((doc) => {
      const data = doc.data();
      content.songs.push({
        id: doc.id,
        title: data.title,
        category: data.category,
        audioUrl: data.audioUrl,
      });
    });

    recentVideos.forEach((doc) => {
      const data = doc.data();
      content.videos.push({
        id: doc.id,
        title: data.title,
        thumbnailUrl: data.thumbnailUrl || getDefaultThumbnail(),
        videoUrl: data.videoUrl,
      });
    });

    return content;
  } catch (error) {
    console.error('Error fetching recent content:', error);
    return { sermons: [], songs: [], videos: [] };
  }
};

// The core fix: searchContent now accepts the necessary functions as arguments
export const searchContent = async (searchTerm, category = null) => {
  try {
    const searchTermLower = searchTerm.toLowerCase();

    // Use the functions directly from the imported scope
    let allSongs = await getSongs();
    let allSermons = await getSermons();
    let allVideos = await getVideos();

    const results = {
      sermons: allSermons.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTermLower) ||
          (item.content && item.content.toLowerCase().includes(searchTermLower))
      ),
      songs: allSongs.filter((item) => {
        const matchesQuery = item.title.toLowerCase().includes(searchTermLower);
        const matchesCategory = category ? item.category === category : true;
        return matchesQuery && matchesCategory;
      }),
      videos: allVideos.filter((item) =>
        item.title.toLowerCase().includes(searchTermLower)
      ),
    };

    return results;
  } catch (error) {
    console.error('Error searching content:', error);
    return { sermons: [], songs: [], videos: [] };
  }
};

// ==========================================
// APP INFO SERVICE
// ==========================================
export const getAppInfo = () => {
  return {
    version: '1.0.0',
    content:
      "Haven is a multilingual church app designed to bring the gospel to people of all languages and backgrounds. Our mission is to spread God's love through hymns, sermons, music, and animated Bible stories.",
    contactEmail: 'info@higher.com.ng',
    churchMission:
      'To glorify God and make disciples of all nations through multilingual worship and biblical teaching.',
  };
};
