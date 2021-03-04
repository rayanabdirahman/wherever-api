import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import { SignInModel, SignUpModel } from '../../domain/interfaces/account';
import { AccountService } from '../../services/account.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import AccountValidator from './account.validator';

@injectable()
export default class AccountController implements RegistrableController {
  private accountService: AccountService;

  constructor(@inject(TYPES.AccountService) accountService: AccountService) {
    this.accountService = accountService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/accounts/signup`, this.signUp);
    app.post(`${config.API_URL}/accounts/signin`, this.signIn);
  }

  signUp = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const model: SignUpModel = {
        ...req.body,
        // default user avatar
        avatar: `https://eu.ui-avatars.com/api/?name=${req.body.name.split(
          ' '
        )}&background=random&bold=true&rounded=true`,
        role: req.body.role && req.body.role
      };

      // validate request body
      const validity = AccountValidator.signUp(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      // generate JWT token
      const token = await this.accountService.signUp(model);

      return ApiResponse.success(res, token);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[AccountController: signup] - Unable to sign up user: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  signIn = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const model: SignInModel = {
        ...req.body
      };

      // validate request body
      const validity = AccountValidator.signIn(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      // generate JWT token
      const token = await this.accountService.signIn(model);

      return ApiResponse.success(res, token);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[AccountController: signIn] - Unable to sign in user: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}
