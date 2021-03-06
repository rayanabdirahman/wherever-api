import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import {
  CreateOrderModel,
  FilterOrderByModel,
  UpdateOrderModel
} from '../../domain/interfaces/order';
import { JwtPayload } from '../../domain/interfaces/user';
import { OrderService } from '../../services/order.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import OrderValidator from './order.validator';

@injectable()
export default class OrderController implements RegistrableController {
  private orderService: OrderService;

  constructor(@inject(TYPES.OrderService) orderService: OrderService) {
    this.orderService = orderService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/orders`, this.createOne);
    app.put(`${config.API_URL}/orders/:_id`, this.updateOne);
    app.get(`${config.API_URL}/orders/:_id`, this.findOne);
    app.get(`${config.API_URL}/orders`, this.findAll);
  }

  createOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      // store authenticated users id
      const { _id } = (req.user as JwtPayload).user;

      const model: CreateOrderModel = {
        ...req.body,
        user: _id
      };

      // validate request body
      const validity = OrderValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const order = await this.orderService.createOne(model);
      return ApiResponse.success(res, order);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[OrderController: createOne] - Unable to create a new order: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  updateOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const model: UpdateOrderModel = {
        ...req.body
      };

      // validate request body
      const validity = OrderValidator.updateOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const order = await this.orderService.findOneByIdAndUpdate(_id, model);
      return ApiResponse.success(res, order);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[OrderController: updateOne] - Unable to find order: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const order = await this.orderService.findOneById(_id);
      return ApiResponse.success(res, order);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[OrderController: findOne] - Unable to find order: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findAll = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      // store authenticated users id
      const { _id } = (req.user as JwtPayload).user;

      const filterBy: FilterOrderByModel = {
        user: _id
      };

      const order = await this.orderService.findAll(filterBy);
      return ApiResponse.success(res, order);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[OrderController: findAll] - Unable to find orders: ${message}`
      );
      return ApiResponse.error(res, error);
    }
  };
}
