import * as Joi from 'joi';
import { UserRolesEnum } from '../../domain/enums/user';
import { SignInModel, SignUpModel } from '../../domain/interfaces/account';

export default class AccountValidator {
  static signUpSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    avatar: Joi.string().required(),
    password: Joi.string().min(8).max(15).required(),
    role: Joi.string().valid(
      UserRolesEnum.BUYER,
      UserRolesEnum.SUPER_ADMIN,
      UserRolesEnum.ORGANISATION_ADMIN,
      UserRolesEnum.STORE_ADMIN
    )
  });

  static signInSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required()
  });

  static signUp(model: SignUpModel): Joi.ValidationResult {
    return this.signUpSchema.validate(model);
  }

  static signIn(model: SignInModel): Joi.ValidationResult {
    return this.signInSchema.validate(model);
  }
}
