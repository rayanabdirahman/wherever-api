import { injectable } from 'inversify';
import {
  CreateProductModel,
  FilterProductByModel
} from '../../domain/interfaces/product';
import Product, { ProductDocument } from '../models/product.model';

export interface ProductRepository {
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
export class ProductRepositoryImpl implements ProductRepository {
  async createOne(model: CreateProductModel): Promise<ProductDocument> {
    const product = new Product(model);
    return await product.save();
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateProductModel
  ): Promise<ProductDocument | null> {
    return await Product.findByIdAndUpdate(_id, model, { new: true });
  }

  async findOneById(_id: string): Promise<ProductDocument | null> {
    return await Product.findOne({ _id }).populate('category');
  }

  async findAll(filterBy: FilterProductByModel): Promise<ProductDocument[]> {
    return await Product.find(filterBy);
  }

  async deleteOne(_id: string): Promise<ProductDocument | null> {
    return await Product.findByIdAndRemove(_id);
  }
}
