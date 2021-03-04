import * as Joi from 'joi';
import { CreateOrganisationModel } from '../../domain/interfaces/organisation';

export default class OrganisationValidator {
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required(),
    members: Joi.array().items(Joi.string()),
    stores: Joi.array().items(Joi.string())
  });

  static createOne(model: CreateOrganisationModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model);
  }
}
