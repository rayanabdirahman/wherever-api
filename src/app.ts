import express from 'express';
import cors from 'cors';
import morgan from './middlewares/http-logger';
import logger from './utilities/logger';
import { RegistrableController } from './api/registrable.controller';
import container from './inversify.config';
import TYPES from './types';
import AuthGuard from './middlewares/auth-guard';
import ApiErrorHandler from './middlewares/api-error';

export default (): Promise<express.Application> =>
  new Promise<express.Application>((resolve, reject) => {
    try {
      const app = express();

      // set middleware
      app.use(cors());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      // use custom HTTP logger for api requests
      app.use(morgan);
      // use express JWT to protect API routes
      app.use(AuthGuard());
      app.use(ApiErrorHandler);

      // register api routes
      const controllers: RegistrableController[] = container.getAll<RegistrableController>(
        TYPES.Controller
      );
      controllers.forEach((controller) => controller.registerRoutes(app));

      // test api route
      app.get(
        '/api/v1',
        async (
          req: express.Request,
          res: express.Response
        ): Promise<express.Response> => {
          return res.json({ 'Wherever API': 'Version 1' });
        }
      );

      resolve(app);
    } catch (error) {
      logger.error(`Error when bootstrapping app: ${error}`);
      reject(error);
    }
  });
