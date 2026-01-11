import { MongoClient } from 'mongodb';

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      const mongoURI = process.env.MONGO_URI;
      this.client = new MongoClient(mongoURI);
      await this.client.connect();
      this.db = this.client.db('node_server');
      console.log('✅ MongoDB connected');
      return true;
    } catch (error) {
      console.error('❌ MongoDB error:', error);
      return false;
    }
  }

  async checkHealth() {
    try {
      if (!this.client) return false;
      await this.client.db('admin').command({ ping: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }

  getDB() {
    return this.db;
  }
}

export const database = new Database();

export const connectDB = () => database.connect();
export const checkDBHealth = () => database.checkHealth();
export const getDB = () => database.getDB();