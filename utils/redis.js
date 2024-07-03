import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a Redis client manager.
 */
class RedisClient {
  /**
   * Initializes a new instance of RedisClient.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;

    this.client.on('error', (err) => {
      console.error('Redis client connection error:', err.message || err.toString());
      this.isClientConnected = false;
    });

    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks if the Redis client is connected.
   * @returns {boolean} True if connected, otherwise false.
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Retrieves the value associated with the specified key from Redis.
   * @param {string} key The key whose value needs to be retrieved.
   * @returns {Promise<string | null>} The value associated with the key, or null if the key does not exist.
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key-value pair in Redis with an expiration time.
   * @param {string} key The key to store.
   * @param {string | number | boolean} value The value to store.
   * @param {number} duration The expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }

  /**
   * Deletes the specified key from Redis.
   * @param {string} key The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
