import { injectable, inject } from 'inversify';
import { ProductDocument } from '../database/models/product.model';
import { ProductRepository } from '../database/repositories/product.repository';
import {
  CreateProductModel,
  FilterProductByModel
} from '../domain/interfaces/product';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface ProductService {
  createOne(model: CreateProductModel): Promise<ProductDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateProductModel
  ): Promise<ProductDocument | null>;
  findOneById(_id: string): Promise<ProductDocument | null>;
  findAll(filterBy: FilterProductByModel): Promise<ProductDocument[]>;
  deleteOne(_id: string): Promise<ProductDocument | null>;
}

@injectable()
export class ProductServiceImpl implements ProductService {
  private productRepository: ProductRepository;

  constructor(
    @inject(TYPES.ProductRepository) productRepository: ProductRepository
  ) {
    this.productRepository = productRepository;
  }

  async createOne(model: CreateProductModel): Promise<ProductDocument> {
    try {
      return await this.productRepository.createOne(model);
    } catch (error) {
      logger.error(
        `[ProductService: createOne]: Unabled to create a new product: ${error}`
      );
      throw error;
    }
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateProductModel
  ): Promise<ProductDocument | null> {
    try {
      const product = await this.productRepository.findOneByIdAndUpdate(
        _id,
        model
      );
      // check if product document is returned
      if (!product) {
        throw new Error('Product with the given id was not found');
      }
      return product;
    } catch (error) {
      logger.error(
        `[ProductService: findOneByIdAndUpdate]: Unabled to update product: ${error}`
      );
      throw error;
    }
  }

  async findOneById(_id: string): Promise<ProductDocument | null> {
    try {
      const product = await this.productRepository.findOneById(_id);
      // check if product document is returned
      if (!product) {
        throw new Error('Product with the given id was not found');
      }
      return product;
    } catch (error) {
      logger.error(
        `[ProductService: findOne]: Unable to find product: ${error}`
      );
      throw error;
    }
  }

  async findAll(filterBy: FilterProductByModel): Promise<ProductDocument[]> {
    try {
      return await this.productRepository.findAll(filterBy);
    } catch (error) {
      logger.error(
        `[ProductService: findAll]: Unable to find products: ${error}`
      );
      throw error;
    }
  }

  async deleteOne(_id: string): Promise<ProductDocument | null> {
    try {
      const product = await this.productRepository.deleteOne(_id);
      // check if deleted product document is returned
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      logger.error(
        `[ProductService: deleteOne]: Unabled to delete product: ${error}`
      );
      throw error;
    }
  }
}
