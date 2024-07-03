import { MongoClient } from 'mongodb';
import envLoader from './env_loader';

/**
 * Represents a MongoDB client manager.
 */
class DBClient {
  /**
   * Initializes a new instance of DBClient.
   * Sets up connection to MongoDB using environment variables or defaults.
   */
  constructor() {
    envLoader(); 

    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(dbURL, { useUnifiedTopology: true });

    this.client.connect()
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
      });
  }

  /**
   * Checks if the MongoDB client is connected.
   * @returns {boolean} True if connected, otherwise false.
   */
  isAlive() {
    return !!this.client && this.client.topology.isConnected();
  }

  /**
   * Retrieves the number of users in the database.
   * @returns {Promise<number>} The number of users.
   */
  async nbUsers() {
    try {
      
      const count = await this.client.db().collection('users').countDocuments();
      return count;
    } catch (error) {
      console.error('Error in nbUsers:', error);
      throw error; 
    }
  }

  /**
   * Retrieves the number of files in the database.
   * @returns {Promise<number>} The number of files.
   */
  async nbFiles() {
    try {
      
      const count = await this.client.db().collection('files').countDocuments();
      return count;
    } catch (error) {
      console.error('Error in nbFiles:', error);
      throw error; 
    }
  }

  /**
   * Closes the MongoDB connection.
   */
  async close() {
    try {
      await this.client.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
}

export const dbClient = new DBClient();
export default dbClient;

// Example usage:
async function printStats() {
  console.log('MongoDB is alive:', dbClient.isAlive());

  try {
    const userCount = await dbClient.nbUsers();
    console.log('Number of users:', userCount);

    const fileCount = await dbClient.nbFiles();
    console.log('Number of files:', fileCount);
  } catch (error) {
    console.error('Error in printStats:', error);
  } finally {
    await dbClient.close();
  }
}

printStats(); 
