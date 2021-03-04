import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import { CreateCategoryModel } from '../../domain/interfaces/category';
import { CategoryService } from '../../services/category.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import CategoryValidator from './category.validator';

@injectable()
export default class CategoryController implements RegistrableController {
  private categoryService: CategoryService;

  constructor(@inject(TYPES.CategoryService) categoryService: CategoryService) {
    this.categoryService = categoryService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/categories`, this.createOne);
    app.put(`${config.API_URL}/categories/:_id`, this.updateOne);
    app.get(`${config.API_URL}/categories/:_id`, this.findOne);
    app.get(`${config.API_URL}/categories`, this.findAll);
    app.delete(`${config.API_URL}/categories/:_id`, this.deleteOne);
  }

  createOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const model: CreateCategoryModel = {
        ...req.body
      };

      // validate request body
      const validity = CategoryValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const category = await this.categoryService.createOne(model);
      return ApiResponse.success(res, category);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[CategoryController: createOne] - Unable to create a new category: ${message}`
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
      const model: CreateCategoryModel = {
        ...req.body
      };

      // validate request body
      const validity = CategoryValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const category = await this.categoryService.findOneByIdAndUpdate(
        _id,
        model
      );
      return ApiResponse.success(res, category);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[CategoryController: updateOne] - Unable to find category: ${message}`
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
      const category = await this.categoryService.findOneById(_id);
      return ApiResponse.success(res, category);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[CategoryController: findOne] - Unable to find category: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findAll = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const categories = await this.categoryService.findAll();
      return ApiResponse.success(res, categories);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[CategoryController: findAll] - Unable to find categories: ${message}`
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
      const category = await this.categoryService.deleteOne(_id);
      return ApiResponse.success(res, category);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[CategoryController: deleteOne] - Unable to delete category: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}
