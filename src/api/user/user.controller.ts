import express from 'express';
import { injectable } from 'inversify';
import config from '../../config';
import { RegistrableController } from '../registrable.controller';

@injectable()
export default class UserController implements RegistrableController {
  registerRoutes(app: express.Application): void {
    // app.get(`${config.API_URL}/users/`, this.findAll);
    // app.get(`${config.API_URL}/users/:_id`, this.findOne);
  }

  // findOne = async (
  //   req: express.Request,
  //   res: express.Response
  // ): Promise<express.Response> => {
  //   try {
  //     const { _id } = req.params;
  //     const category = await this.categoryService.findOneById(_id);
  //     return ApiResponse.success(res, category);
  //   } catch (error) {
  //     const message = error.message || error;
  //     logger.error(
  //       `[CategoryController: findOne] - Unable to find category: ${message}`
  //     );
  //     return ApiResponse.error(res, message);
  //   }
  // };
}
