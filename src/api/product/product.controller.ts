import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import {
  CreateProductModel,
  FilterProductByModel
} from '../../domain/interfaces/product';
import { ProductService } from '../../services/product.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import ProductValidator from './product.validator';

@injectable()
export default class ProductController implements RegistrableController {
  private productService: ProductService;

  constructor(@inject(TYPES.ProductService) productService: ProductService) {
    this.productService = productService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/products`, this.createOne);
    app.put(`${config.API_URL}/products/:_id`, this.updateOne);
    app.get(`${config.API_URL}/products/:_id`, this.findOne);
    app.get(`${config.API_URL}/products`, this.findAll);
    app.delete(`${config.API_URL}/products/:_id`, this.deleteOne);
  }

  createOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const model: CreateProductModel = {
        ...req.body
      };

      // validate request body
      const validity = ProductValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const product = await this.productService.createOne(model);
      return ApiResponse.success(res, product);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[ProductController: createOne] - Unable to create a new product: ${message}`
      );
      return ApiResponse.error(res, error);
    }
  };

  updateOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const model: CreateProductModel = {
        ...req.body
      };

      // validate request body
      const validity = ProductValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const product = await this.productService.findOneByIdAndUpdate(
        _id,
        model
      );
      return ApiResponse.success(res, product);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[ProductController: updateOne] - Unable to find product: ${message}`
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
      const product = await this.productService.findOneById(_id);
      return ApiResponse.success(res, product);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[ProductController: findOne] - Unable to find product: ${message}`
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
      } as unknown) as FilterProductByModel;

      const products = await this.productService.findAll(filterBy);
      return ApiResponse.success(res, products);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[ProductController: findAll] - Unable to find products: ${message}`
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
      const product = await this.productService.deleteOne(_id);
      return ApiResponse.success(res, product);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[ProductController: deleteOne] - Unable to delete product: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}
