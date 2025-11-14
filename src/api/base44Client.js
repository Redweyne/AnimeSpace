// Base44 Client Mock - Simulates Base44 backend functionality
// In a real Base44 app, this would connect to Replit's Base44 service

const STORAGE_KEY = 'animemoments_data';
const AUTH_KEY = 'animemoments_auth';

// Simple in-memory storage simulation
class MockStorage {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { AnimeMoment: [], Comment: [] };
    } catch {
      return { AnimeMoment: [], Comment: [] };
    }
  }

  saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }
}

const storage = new MockStorage();

// Entity API
class EntityAPI {
  constructor(entityName) {
    this.entityName = entityName;
  }

  async list(sortField) {
    const collection = storage.getCollection(this.entityName);
    let sorted = [...collection];
    
    if (sortField) {
      const isDesc = sortField.startsWith('-');
      const field = isDesc ? sortField.slice(1) : sortField;
      sorted.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return isDesc ? -comparison : comparison;
      });
    }
    
    return sorted;
  }

  async get(id) {
    const collection = storage.getCollection(this.entityName);
    return collection.find(item => item.id === id);
  }

  async create(data) {
    const collection = storage.getCollection(this.entityName);
    const newItem = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_date: new Date().toISOString(),
    };
    collection.push(newItem);
    storage.saveData();
    return newItem;
  }

  async update(id, data) {
    const collection = storage.getCollection(this.entityName);
    const index = collection.findIndex(item => item.id === id);
    if (index !== -1) {
      collection[index] = { ...collection[index], ...data };
      storage.saveData();
      return collection[index];
    }
    throw new Error('Item not found');
  }

  async delete(id) {
    const collection = storage.getCollection(this.entityName);
    const index = collection.findIndex(item => item.id === id);
    if (index !== -1) {
      collection.splice(index, 1);
      storage.saveData();
      return true;
    }
    return false;
  }

  async filter(criteria = {}, sortField) {
    const collection = storage.getCollection(this.entityName);
    let filtered = collection;
    
    if (criteria && Object.keys(criteria).length > 0) {
      filtered = collection.filter(item => {
        return Object.entries(criteria).every(([key, value]) => item[key] === value);
      });
    }
    
    if (sortField) {
      const isDesc = sortField.startsWith('-');
      const field = isDesc ? sortField.slice(1) : sortField;
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return isDesc ? -comparison : comparison;
      });
    }
    
    return filtered;
  }
}

// Auth API
const authAPI = {
  async me() {
    try {
      const user = localStorage.getItem(AUTH_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  redirectToLogin() {
    const mockUser = {
      email: 'demo@animemoments.com',
      full_name: 'Demo User',
      id: 'demo-user-id',
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
    window.location.reload();
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
  },
};

// Main Base44 client
export const base44 = {
  entities: {
    AnimeMoment: new EntityAPI('AnimeMoment'),
    Comment: new EntityAPI('Comment'),
  },
  auth: authAPI,
};

// Initialize with sample data if empty
if (storage.getCollection('AnimeMoment').length === 0) {
  const sampleMoments = [
    {
      id: '1',
      title: 'Luffy\'s Gear Fifth Awakening',
      anime_name: 'One Piece',
      episode: 'Episode 1071',
      description: 'The most epic transformation in anime history! Luffy awakens his Devil Fruit and turns into the Sun God Nika. The animation, the laughter, the pure joy - everything about this moment was perfect!',
      image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop',
      likes: ['demo@animemoments.com', 'sakura_fan@anime.com', 'otaku_master@mail.com'],
      tags: ['epic', 'transformation', 'one-piece'],
      created_date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      title: 'Gojo vs Sukuna Domain Clash',
      anime_name: 'Jujutsu Kaisen',
      episode: 'Season 2 Episode 9',
      description: 'The most visually stunning fight in modern anime! Two of the strongest sorcerers clashing their domains. The cinematography and animation were absolutely breathtaking.',
      image_url: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800&h=600&fit=crop',
      likes: ['demo@animemoments.com', 'anime_lover99@gmail.com'],
      tags: ['action', 'jujutsu-kaisen', 'fight'],
      created_date: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '3',
      title: 'Tanjiro\'s Hinokami Kagura',
      anime_name: 'Demon Slayer',
      episode: 'Season 1 Episode 19',
      description: 'The episode that broke the internet! Tanjiro unlocks his father\'s technique and saves the day. The animation quality was insane, especially the fire dance sequence.',
      image_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=600&fit=crop',
      likes: ['naruto_fan@email.com', 'weeb_life@anime.com'],
      tags: ['demon-slayer', 'epic', 'animation'],
      created_date: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: '4',
      title: 'All Might vs All For One Final Battle',
      anime_name: 'My Hero Academia',
      episode: 'Season 3 Episode 49',
      description: 'The Symbol of Peace\'s last stand! All Might pushing beyond his limits to protect everyone. When he said "I am here!" one last time, I literally cried. Pure heroism!',
      image_url: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&h=600&fit=crop',
      likes: ['hero_academia_fan@mail.com', 'plus_ultra@anime.com', 'demo@animemoments.com'],
      tags: ['my-hero-academia', 'emotional', 'fight', 'heroic'],
      created_date: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: '5',
      title: 'Eren\'s Declaration of War',
      anime_name: 'Attack on Titan',
      episode: 'Season 4 Episode 5',
      description: 'The moment everything changed. Eren\'s transformation in Liberio was chilling. The way the episode built up tension and then BOOM! Absolutely masterful storytelling.',
      image_url: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?w=800&h=600&fit=crop',
      likes: ['titan_slayer@email.com', 'freedom_fighter@anime.com', 'manga_reader@mail.com', 'aot_obsessed@gmail.com'],
      tags: ['attack-on-titan', 'intense', 'plot-twist'],
      created_date: new Date(Date.now() - 432000000).toISOString(),
    },
    {
      id: '6',
      title: 'Levi vs Beast Titan',
      anime_name: 'Attack on Titan',
      episode: 'Season 3 Episode 17',
      description: 'Humanity\'s strongest soldier going absolutely FERAL! The way Levi dismantled the Beast Titan was the most satisfying thing I\'ve ever watched. Pure badassery!',
      image_url: 'https://images.unsplash.com/photo-1573588028698-f4759befb09a?w=800&h=600&fit=crop',
      likes: ['levi_squad@anime.com', 'scout_regiment@mail.com', 'demo@animemoments.com', 'action_junkie@gmail.com'],
      tags: ['attack-on-titan', 'action', 'epic', 'levi'],
      created_date: new Date(Date.now() - 518400000).toISOString(),
    },
    {
      id: '7',
      title: 'Naruto vs Pain - Talk No Jutsu Peak',
      anime_name: 'Naruto Shippuden',
      episode: 'Episode 166-167',
      description: 'Not just an epic fight, but Naruto\'s ideology clash with Pain. When Naruto chose to break the cycle of hatred, that was TRUE shinobi. Believe it!',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      likes: ['hokage_dreams@anime.com', 'ramen_lover@mail.com', 'hidden_leaf@email.com'],
      tags: ['naruto', 'philosophy', 'emotional', 'epic-fight'],
      created_date: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: '8',
      title: 'Mob at 100% vs Toichiro',
      anime_name: 'Mob Psycho 100',
      episode: 'Season 2 Episode 13',
      description: 'The most beautiful psychic battle ever animated! When Mob chose kindness over power at 100%, I was bawling. This show is a masterpiece of character development.',
      image_url: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&h=600&fit=crop',
      likes: ['psychic_boy@anime.com', 'reigen_fan@mail.com', 'animation_lover@gmail.com', 'demo@animemoments.com'],
      tags: ['mob-psycho', 'wholesome', 'animation', 'character-growth'],
      created_date: new Date(Date.now() - 691200000).toISOString(),
    },
    {
      id: '9',
      title: 'Saitama vs Boros',
      anime_name: 'One Punch Man',
      episode: 'Episode 12',
      description: 'The animation quality was OUT OF THIS WORLD! Boros gave Saitama the closest thing to a real fight. That Serious Punch at the end... absolutely legendary!',
      image_url: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=800&h=600&fit=crop',
      likes: ['bald_hero@anime.com', 'one_punch@mail.com'],
      tags: ['one-punch-man', 'action', 'comedy', 'overpowered'],
      created_date: new Date(Date.now() - 777600000).toISOString(),
    },
    {
      id: '10',
      title: 'Violet Evergarden\'s Letter to Her Mother',
      anime_name: 'Violet Evergarden',
      episode: 'Episode 10',
      description: 'I\'m not crying, you\'re crying! The letters to Ann were devastating. KyoAni really knows how to destroy you emotionally while making it beautiful.',
      image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop',
      likes: ['kyoani_forever@anime.com', 'tissues_ready@mail.com', 'emotional_wreck@gmail.com', 'violet_fan@anime.com', 'demo@animemoments.com'],
      tags: ['violet-evergarden', 'emotional', 'tear-jerker', 'kyoani'],
      created_date: new Date(Date.now() - 864000000).toISOString(),
    },
    {
      id: '11',
      title: 'Edward\'s Human Transmutation Truth',
      anime_name: 'Fullmetal Alchemist: Brotherhood',
      episode: 'Episode 64',
      description: 'Edward giving up his alchemy to bring Alphonse back. "A lesson without pain is meaningless." The PERFECT conclusion to his character arc. Brotherhood is peak fiction!',
      image_url: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=800&h=600&fit=crop',
      likes: ['elric_brothers@anime.com', 'truth_seeker@mail.com', 'fma_forever@gmail.com'],
      tags: ['fullmetal-alchemist', 'brotherhood', 'emotional', 'character-arc'],
      created_date: new Date(Date.now() - 950400000).toISOString(),
    },
    {
      id: '12',
      title: 'Spike\'s Final Showdown',
      anime_name: 'Cowboy Bebop',
      episode: 'Episode 26',
      description: 'Bang. Just... bang. Spike\'s journey ending with that smile. Peak storytelling, peak animation, peak everything. This is why Bebop is timeless.',
      image_url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800&h=600&fit=crop',
      likes: ['space_cowboy@anime.com', 'jazz_lover@mail.com', 'classic_anime@gmail.com', 'demo@animemoments.com'],
      tags: ['cowboy-bebop', 'classic', 'bittersweet', 'masterpiece'],
      created_date: new Date(Date.now() - 1036800000).toISOString(),
    },
    {
      id: '13',
      title: 'Denji\'s First Transformation',
      anime_name: 'Chainsaw Man',
      episode: 'Episode 1',
      description: 'MAPPA absolutely COOKED with this! The way Denji pulled that chainsaw cord and the music kicked in - instant hype! This is how you start an anime!',
      image_url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop',
      likes: ['chainsaw_devil@anime.com', 'mappa_fan@mail.com', 'power_simp@gmail.com', 'makima_worshipper@anime.com'],
      tags: ['chainsaw-man', 'hype', 'dark', 'mappa'],
      created_date: new Date(Date.now() - 1123200000).toISOString(),
    },
    {
      id: '14',
      title: 'Makima\'s Bang Moment',
      anime_name: 'Chainsaw Man',
      episode: 'Episode 8',
      description: 'That whole sequence in the forest was TERRIFYING. Makima is absolutely menacing and I love it. The sound design alone gave me chills!',
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
      likes: ['control_devil@anime.com', 'horror_fan@mail.com', 'makima_worshipper@anime.com'],
      tags: ['chainsaw-man', 'dark', 'horror', 'antagonist'],
      created_date: new Date(Date.now() - 1209600000).toISOString(),
    },
    {
      id: '15',
      title: 'Maki vs Cursed Spirits After Mai',
      anime_name: 'Jujutsu Kaisen',
      episode: 'Season 2 Episode 17',
      description: 'Maki went ABSOLUTELY CRAZY! Her awakening after losing Mai was devastating and powerful at the same time. MAPPA\'s animation made it even more impactful!',
      image_url: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=800&h=600&fit=crop',
      likes: ['zenin_clan_hater@anime.com', 'maki_supremacy@mail.com', 'jjk_fan@gmail.com', 'demo@animemoments.com'],
      tags: ['jujutsu-kaisen', 'emotional', 'badass', 'character-development'],
      created_date: new Date(Date.now() - 1296000000).toISOString(),
    },
    {
      id: '16',
      title: 'Yuji & Todo vs Hanami',
      anime_name: 'Jujutsu Kaisen',
      episode: 'Season 1 Episode 19',
      description: 'TODO AND YUJI ARE BEST FRIENDS NOW! Boogie Woogie is the coolest technique ever! The bromance, the combat choreography - absolute cinema!',
      image_url: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&h=600&fit=crop',
      likes: ['todo_aoi@anime.com', 'itadori_yuji@mail.com', 'best_friends@gmail.com'],
      tags: ['jujutsu-kaisen', 'bromance', 'action', 'comedy'],
      created_date: new Date(Date.now() - 1382400000).toISOString(),
    },
    {
      id: '17',
      title: 'Thorfinn\'s True Warrior Speech',
      anime_name: 'Vinland Saga',
      episode: 'Season 2 Episode 24',
      description: 'After everything Thorfinn went through, seeing him finally understand what it means to be a true warrior... this is peak character development. I have no enemies.',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      likes: ['viking_saga@anime.com', 'pacifist_warrior@mail.com', 'character_growth@gmail.com', 'demo@animemoments.com'],
      tags: ['vinland-saga', 'character-growth', 'philosophy', 'emotional'],
      created_date: new Date(Date.now() - 1468800000).toISOString(),
    },
    {
      id: '18',
      title: 'Anya\'s First Stella Star',
      anime_name: 'Spy x Family',
      episode: 'Episode 6',
      description: 'Anya trying her best to get a Stella star is the most wholesome thing! When Loid was proud of her, my heart melted. This family is too precious!',
      image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop',
      likes: ['forger_family@anime.com', 'wholesome_anime@mail.com', 'anya_fan@gmail.com', 'waku_waku@anime.com', 'peanuts_lover@mail.com'],
      tags: ['spy-x-family', 'wholesome', 'comedy', 'family'],
      created_date: new Date(Date.now() - 1555200000).toISOString(),
    },
  ];
  
  sampleMoments.forEach(moment => {
    storage.data.AnimeMoment.push(moment);
  });
  storage.saveData();
}
