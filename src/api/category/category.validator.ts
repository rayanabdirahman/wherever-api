import * as Joi from 'joi';
import { CreateCategoryModel } from '../../domain/interfaces/category';

export default class CategoryValidator {
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required(),
    color: Joi.string().required(),
    icon: Joi.string().required()
  });

  static createOne(model: CreateCategoryModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model);
  }
}
