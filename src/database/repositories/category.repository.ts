import { injectable } from 'inversify';
import { CreateCategoryModel } from '../../domain/interfaces/category';
import Category, { CategoryDocument } from '../models/category.model';

export interface CategoryRepository {
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
export class CategoryRepositoryImpl implements CategoryRepository {
  async createOne(model: CreateCategoryModel): Promise<CategoryDocument> {
    const category = new Category(model);
    return await category.save();
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateCategoryModel
  ): Promise<CategoryDocument | null> {
    return await Category.findByIdAndUpdate(_id, model, { new: true });
  }

  async findOneById(_id: string): Promise<CategoryDocument | null> {
    return await Category.findOne({ _id });
  }

  async findAll(): Promise<CategoryDocument[]> {
    return await Category.find();
  }

  async deleteOne(_id: string): Promise<CategoryDocument | null> {
    return await Category.findByIdAndRemove(_id);
  }
}
