import * as Joi from 'joi';
import { CreateStoreModel } from '../../domain/interfaces/store';

export default class StoreValidator {
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required(),
    members: Joi.array().items(Joi.string()),
    organisation: Joi.string().required()
  });

  static createOne(model: CreateStoreModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model);
  }
}
