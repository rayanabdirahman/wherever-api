import express from 'express';
import { injectable } from 'inversify';
import config from '../../config';
import { RegistrableController } from '../registrable.controller';

@injectable()
export default class OrderController implements RegistrableController {
  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/orders`, (req, res) =>
      res.send({ hello: 'order' })
    );
  }
}
