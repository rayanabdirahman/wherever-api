import { injectable, inject } from 'inversify';
import { CategoryDocument } from '../database/models/category.model';
import { CategoryRepository } from '../database/repositories/category.repository';
import { CreateCategoryModel } from '../domain/interfaces/category';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface CategoryService {
  createOne(model: CreateCategoryModel): Promise<CategoryDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateCategoryModel
  ): Promise<CategoryDocument | null>;
  findOneById(_id: string): Promise<CategoryDocument | null>;
  findAll(): Promise<CategoryDocument[]>;
  deleteOne(_id: string): Promise<CategoryDocument | null>;
}

@injectable()
export class CategoryServiceImpl implements CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(
    @inject(TYPES.CategoryRepository) categoryRepository: CategoryRepository
  ) {
    this.categoryRepository = categoryRepository;
  }

  async createOne(model: CreateCategoryModel): Promise<CategoryDocument> {
    try {
      return await this.categoryRepository.createOne(model);
    } catch (error) {
      logger.error(
        `[CategoryService: createOne]: Unabled to create a new category: ${error}`
      );
      throw error;
    }
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateCategoryModel
  ): Promise<CategoryDocument | null> {
    try {
      const category = await this.categoryRepository.findOneByIdAndUpdate(
        _id,
        model
      );
      // check if category document is returned
      if (!category) {
        throw new Error('Category with the given id was not found');
      }
      return category;
    } catch (error) {
      logger.error(
        `[CategoryService: findOneByIdAndUpdate]: Unabled to update category: ${error}`
      );
      throw error;
    }
  }

  async findOneById(_id: string): Promise<CategoryDocument | null> {
    try {
      const category = await this.categoryRepository.findOneById(_id);
      // check if category document is returned
      if (!category) {
        throw new Error('Category with the given id was not found');
      }
      return category;
    } catch (error) {
      logger.error(
        `[CategoryService: findOne]: Unable to find category: ${error}`
      );
      throw error;
    }
  }

  async findAll(): Promise<CategoryDocument[]> {
    try {
      return await this.categoryRepository.findAll();
    } catch (error) {
      logger.error(
        `[CategoryService: findAll]: Unable to find categories: ${error}`
      );
      throw error;
    }
  }

  async deleteOne(_id: string): Promise<CategoryDocument | null> {
    try {
      const category = await this.categoryRepository.deleteOne(_id);
      // check if deleted category document is returned
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      logger.error(
        `[CategoryService: deleteOne]: Unabled to delete category: ${error}`
      );
      throw error;
    }
  }
}
