import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

export default class AuthController {
  /**
   * Generates a new authentication token for the user and stores it in Redis.
   * @param {Request} req Express request object containing user information.
   * @param {Response} res Express response object.
   * @returns {Promise<void>}
   */
  static async getConnect(req, res) {
    const { user } = req;
    const token = uuidv4();

    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token });
  }

  /**
   * Deletes the authentication token from Redis upon user logout.
   * @param {Request} req Express request object containing the authentication token in headers.
   * @param {Response} res Express response object.
   * @returns {Promise<void>}
   */
  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}
