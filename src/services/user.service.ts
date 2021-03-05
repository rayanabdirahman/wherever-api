import { injectable, inject } from 'inversify';
import { UserDocument } from '../database/models/user.model';
import { UserRepository } from '../database/repositories/user.repository';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface UserService {
  findOneById(_id: string): Promise<UserDocument | null>;
  findAll(): Promise<UserDocument[]>;
}

@injectable()
export class UserServiceImpl implements UserService {
  private userRepository: UserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async findOneById(_id: string): Promise<UserDocument | null> {
    try {
      const user = await this.userRepository.findOneById(_id);
      // check if user document is returned
      if (!user) {
        throw new Error('User with the given id was not found');
      }
      return user;
    } catch (error) {
      logger.error(`[UserService: findOne]: Unable to find user: ${error}`);
      throw error;
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      logger.error(`[UserService: findAll]: Unable to find users: ${error}`);
      throw error;
    }
  }
}
