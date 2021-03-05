import { injectable, inject } from 'inversify';
import { AddressDocument } from '../database/models/address.model';
import { AddressRepository } from '../database/repositories/address.repository';
import {
  CreateAddressModel,
  FilterAddressByModel
} from '../domain/interfaces/address';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface AddressService {
  createOne(model: CreateAddressModel): Promise<AddressDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateAddressModel
  ): Promise<AddressDocument | null>;
  findOneById(_id: string): Promise<AddressDocument | null>;
  findAll(filterBy: FilterAddressByModel): Promise<AddressDocument[]>;
  // deleteOne(_id: string): Promise<AddressDocument | null>;
}

@injectable()
export class AddressServiceImpl implements AddressService {
  private addressRepository: AddressRepository;

  constructor(
    @inject(TYPES.AddressRepository)
    addressRepository: AddressRepository
  ) {
    this.addressRepository = addressRepository;
  }

  async createOne(model: CreateAddressModel): Promise<AddressDocument> {
    try {
      return await this.addressRepository.createOne(model);
    } catch (error) {
      logger.error(
        `[AddressService: createOne]: Unabled to create a new address: ${error}`
      );
      throw error;
    }
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateAddressModel
  ): Promise<AddressDocument | null> {
    try {
      const address = await this.addressRepository.findOneByIdAndUpdate(
        _id,
        model
      );
      // check if address document is returned
      if (!address) {
        throw new Error('Address with the given id was not found');
      }
      return address;
    } catch (error) {
      logger.error(
        `[AddressService: findOneByIdAndUpdate]: Unabled to update address: ${error}`
      );
      throw error;
    }
  }

  async findOneById(_id: string): Promise<AddressDocument | null> {
    try {
      const address = await this.addressRepository.findOneById(_id);
      // check if address document is returned
      if (!address) {
        throw new Error('Address with the given id was not found');
      }
      return address;
    } catch (error) {
      logger.error(
        `[AddressService: findOne]: Unable to find address: ${error}`
      );
      throw error;
    }
  }

  async findAll(filterBy: FilterAddressByModel): Promise<AddressDocument[]> {
    try {
      return await this.addressRepository.findAll(filterBy);
    } catch (error) {
      logger.error(
        `[AddressService: findAll]: Unable to find addresses: ${error}`
      );
      throw error;
    }
  }

  // async deleteOne(_id: string): Promise<AddressDocument | null> {
  //   try {
  //     const store = await this.addressRepository.deleteOne(_id);
  //     // check if deleted store document is returned
  //     if (!store) {
  //       throw new Error('Store with the given id was not found');
  //     }

  //     // remove store id from organisation store document
  //     // await this.organisationRepository.findOneByIdAndPullFromKey(
  //     //   store.organisation,
  //     //   'stores',
  //     //   (store._id as unknown) as string
  //     // );

  //     return store;
  //   } catch (error) {
  //     logger.error(
  //       `[AddressService: deleteOne]: Unabled to delete store: ${error}`
  //     );
  //     throw error;
  //   }
  // }
}
