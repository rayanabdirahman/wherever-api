import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import {
  CreateStoreModel,
  FilterStoreByModel
} from '../../domain/interfaces/store';
import { StoreService } from '../../services/store.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import StoreValidator from './store.validator';

@injectable()
export default class StoreController implements RegistrableController {
  private storeService: StoreService;

  constructor(@inject(TYPES.StoreService) storeService: StoreService) {
    this.storeService = storeService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/stores`, this.createOne);
    app.put(`${config.API_URL}/stores/:_id`, this.updateOne);
    app.get(`${config.API_URL}/stores/:_id`, this.findOne);
    app.get(`${config.API_URL}/stores`, this.findAll);
    app.delete(`${config.API_URL}/stores/:_id`, this.deleteOne);
  }

  createOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const model: CreateStoreModel = {
        ...req.body
      };

      // validate request body
      const validity = StoreValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const store = await this.storeService.createOne(model);
      return ApiResponse.success(res, store);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[StoreController: createOne] - Unable to create a new store: ${message}`
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
      const model: CreateStoreModel = {
        ...req.body
      };

      // validate request body
      const validity = StoreValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const store = await this.storeService.findOneByIdAndUpdate(_id, model);
      return ApiResponse.success(res, store);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[StoreController: updateOne] - Unable to find store: ${message}`
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
      const store = await this.storeService.findOneById(_id);
      return ApiResponse.success(res, store);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[StoreController: findOne] - Unable to find store: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findAll = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      // check if query params have been passed
      const filterBy = ({
        ...req.query
      } as unknown) as FilterStoreByModel;

      const stores = await this.storeService.findAll(filterBy);
      return ApiResponse.success(res, stores);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[StoreController: findAll] - Unable to find stores: ${message}`
      );
      return ApiResponse.error(res, error);
    }
  };

  deleteOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const store = await this.storeService.deleteOne(_id);
      return ApiResponse.success(res, store);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[StoreController: deleteOne] - Unable to delete store: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}
