import * as Joi from 'joi';
import { CreateAddressModel } from '../../domain/interfaces/address';

export default class AddressValidator {
  static createOneSchema: Joi.ObjectSchema = Joi.object({
    user: Joi.string().required(),
    country: Joi.string().required(),
    fullName: Joi.string().required(),
    streetAddress: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postCode: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    deliveryInstructions: Joi.string().required(),
    securityCode: Joi.string().required(),
  });

  static createOne(model: CreateAddressModel): Joi.ValidationResult {
    return this.createOneSchema.validate(model);
  }
}
