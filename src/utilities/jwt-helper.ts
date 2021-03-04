import jwt from 'jsonwebtoken';
import { UserDocument } from '../database/models/user.model';
import logger from './logger';
import { JwtPayload } from '../domain/interfaces/user';
import config from '../config';

interface IJwtHelper {
  sign(user: UserDocument): Promise<string>;
  decode(token: string): Promise<JwtPayload>;
}

const JwtHelper: IJwtHelper = {
  async sign(user: UserDocument): Promise<string> {
    const payload: JwtPayload = {
      user: {
        _id: (user._id as unknown) as string,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    };

    return await jwt.sign(payload, `${config.API_JWT_SECRET}`, {
      // expires in one week
      expiresIn: `1w`
    });
  },

  async decode(token: string): Promise<JwtPayload> {
    try {
      return (await jwt.verify(
        token,
        `${config.API_JWT_SECRET}`
      )) as JwtPayload;
    } catch (error) {
      const { message } = error;
      logger.error(`[JwtHelper] - Unable to decode user token: ${message}`);
      throw message;
    }
  }
};

export default JwtHelper;
