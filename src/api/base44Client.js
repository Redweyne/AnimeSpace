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
      likes: ['demo@animemoments.com'],
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
      likes: ['demo@animemoments.com'],
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
      likes: [],
      tags: ['demon-slayer', 'epic', 'animation'],
      created_date: new Date(Date.now() - 259200000).toISOString(),
    },
  ];
  
  sampleMoments.forEach(moment => {
    storage.data.AnimeMoment.push(moment);
  });
  storage.saveData();
}
