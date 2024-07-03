import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export default class AppController {
  /**
   * GET /status endpoint handler.
   * Returns if Redis and DB are alive.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async getStatus(req, res) {
    try {
      const redisIsAlive = redisClient.isAlive();
      const dbIsAlive = await dbClient.isAlive();

      res.status(200).json({
        redis: redisIsAlive,
        db: dbIsAlive,
      });
    } catch (error) {
      console.error('Error in getStatus:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * GET /stats endpoint handler.
   * Returns the number of users and files in the DB.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();

      res.status(200).json({
        users: usersCount,
        files: filesCount,
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}