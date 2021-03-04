import * as Joi from 'joi';
import { CreateProductModel } from '../../domain/interfaces/product';

export default class ProductValidator {
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    brand: Joi.string().required(),
    price: Joi.number().required(),
    countInStock: Joi.number().required(),
    rating: Joi.number().required(),
    numReviews: Joi.number().required(),
    isFeatured: Joi.boolean(),
    category: Joi.string().required(),
    store: Joi.string().required(),
    organisation: Joi.string().required()
  });

  static createOne(model: CreateProductModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model);
  }
}
