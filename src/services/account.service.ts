import { injectable, inject } from 'inversify';
// import { UserDocument } from '../database/models/user.model';
import { AccountRepository } from '../database/repositories/account.repository';
import { SignInModel, SignUpModel } from '../domain/interfaces/account';
import TYPES from '../types';
import BycryptHelper from '../utilities/bcrypt-helper';
import JwtHelper from '../utilities/jwt-helper';
import logger from '../utilities/logger';

export interface AccountService {
  signUp(model: SignUpModel): Promise<string>;
  signIn(model: SignInModel): Promise<string>;
}

@injectable()
export class AccountServiceImpl implements AccountService {
  private accountRepository: AccountRepository;

  constructor(
    @inject(TYPES.AccountRepository) accountRepository: AccountRepository
  ) {
    this.accountRepository = accountRepository;
  }

  async signUp(model: SignUpModel): Promise<string> {
    try {
      const user = await this.accountRepository.createOne(model);

      // sign JWT token
      return await JwtHelper.sign(user);
    } catch (error) {
      if (error.code === 11000) {
        error.message = `A user with the given username or email exists`;
      }
      logger.error(
        `[AccountService: signUp]: Unabled to create a new user: ${error}`
      );
      throw error;
    }
  }

  async signIn(model: SignInModel): Promise<string> {
    try {
      // find user by email address
      const user = await this.accountRepository.findOneByEmail(
        model.email,
        false
      );
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // check if passwords match
      const doPasswordsMatch = await BycryptHelper.comparePassword(
        model.password,
        user.password
      );
      if (!doPasswordsMatch) {
        throw new Error('Invalid credentials');
      }

      // sign JWT token
      return await JwtHelper.sign(user);
    } catch (error) {
      logger.error(
        `[AccountService: signIn]: Unabled to sign in user: ${error}`
      );
      throw error;
    }
  }
}
