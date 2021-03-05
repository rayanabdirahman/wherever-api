import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import { UserService } from '../../services/user.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';

@injectable()
export default class UserController implements RegistrableController {
  private userService: UserService;

  constructor(@inject(TYPES.UserService) userService: UserService) {
    this.userService = userService;
  }

  registerRoutes(app: express.Application): void {
    app.get(`${config.API_URL}/users/`, this.findAll);
    app.get(`${config.API_URL}/users/:_id`, this.findOne);
  }

  findAll = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const users = await this.userService.findAll();
      return ApiResponse.success(res, users);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[UserController: findAll] - Unable to find users: ${message}`
      );
      return ApiResponse.error(res, error);
    }
  };

  findOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const user = await this.userService.findOneById(_id);
      return ApiResponse.success(res, user);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[UserController: findOne] - Unable to find user: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}
