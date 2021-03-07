import { injectable, inject } from 'inversify';
import { ProductDocument } from '../database/models/product.model';
import { ProductRepository } from '../database/repositories/product.repository';
import {
  CreateProductModel,
  FilterProductByModel
} from '../domain/interfaces/product';
import TYPES from '../types';
import logger from '../utilities/logger';
import { CloudinaryService } from './cloudinary.service';

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

// TODO: Add status to prodct: status: 'Out of stock', 'Deleted', etc
@injectable()
export class ProductServiceImpl implements ProductService {
  private productRepository: ProductRepository;
  private cloudinaryService: CloudinaryService;

  constructor(
    @inject(TYPES.ProductRepository) productRepository: ProductRepository,
    @inject(TYPES.CloudinaryService) cloudinaryService: CloudinaryService
  ) {
    this.productRepository = productRepository;
    this.cloudinaryService = cloudinaryService;
  }

  async createOne(model: CreateProductModel): Promise<ProductDocument> {
    try {
      // upload image to cloudinary and set url as image
      const uploadedImage = await this.cloudinaryService.upload(model.image);
      const updatedModel: CreateProductModel = {
        ...model,
        image: uploadedImage
      };

      return await this.productRepository.createOne(updatedModel);
    } catch (error) {
      logger.error(
        `[ProductService: createOne]: Unable to create a new product: ${error}`
      );
      throw error;
    }
  }

  // TODO: check if image as been updated
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
        `[ProductService: findOneByIdAndUpdate]: Unable to update product: ${error}`
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
      // find product in db
      const product = await this.productRepository.findOneById(_id);
      // check if product document is returned
      if (!product) {
        throw new Error('Product with the given id was not found');
      }

      // delete image from cloudinary
      await this.cloudinaryService.remove(product.image);

      // delete product form db
      return await this.productRepository.deleteOne(_id);
    } catch (error) {
      logger.error(
        `[ProductService: deleteOne]: Unable to delete product: ${error}`
      );
      throw error;
    }
  }
}
