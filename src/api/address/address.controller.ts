import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import {
  CreateAddressModel,
  FilterAddressByModel
} from '../../domain/interfaces/address';
import { JwtPayload } from '../../domain/interfaces/user';
import { AddressService } from '../../services/address.service';
// import { UserService } from '../../services/user.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import AddressValidator from './address.validator';

@injectable()
export default class AddressController implements RegistrableController {
  private addressService: AddressService;

  constructor(@inject(TYPES.AddressService) addressService: AddressService) {
    this.addressService = addressService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/addresses`, this.createOne);
    app.get(`${config.API_URL}/addresses`, this.findAll);
    app.get(`${config.API_URL}/addresses/:_id`, this.findOne);
  }

  createOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      // store authenticated users id
      const { _id } = (req.user as JwtPayload).user;

      const model: CreateAddressModel = {
        ...req.body,
        user: _id
      };

      // validate request body
      const validity = AddressValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const address = await this.addressService.createOne(model);
      return ApiResponse.success(res, address);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[AddressController: createOne] - Unable to create a new address: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findAll = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      // store authenticated users id
      const { _id } = (req.user as JwtPayload).user;

      const filterBy: FilterAddressByModel = {
        user: _id
      };

      const addresss = await this.addressService.findAll(filterBy);
      return ApiResponse.success(res, addresss);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[AddressController: findAll] - Unable to find addresses: ${message}`
      );
      return ApiResponse.error(res, error);
    }
  };

  findOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const address = await this.addressService.findOneById(_id);
      return ApiResponse.success(res, address);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[AddressController: findOne] - Unable to find address: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}
