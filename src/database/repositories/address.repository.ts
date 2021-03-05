import { injectable } from 'inversify';
import {
  CreateAddressModel,
  FilterAddressByModel
} from '../../domain/interfaces/address';
import Address, { AddressDocument } from '../models/address.model';

export interface AddressRepository {
  createOne(model: CreateAddressModel): Promise<AddressDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateAddressModel
  ): Promise<AddressDocument | null>;
  findOneById(_id: string): Promise<AddressDocument | null>;
  findOneByName(email: string): Promise<AddressDocument | null>;
  findAll(filterBy: FilterAddressByModel): Promise<AddressDocument[]>;
  deleteOne(_id: string): Promise<AddressDocument | null>;
}

@injectable()
export class AddressRepositoryImpl implements AddressRepository {
  async createOne(model: CreateAddressModel): Promise<AddressDocument> {
    const address = new Address(model);
    return await address.save();
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateAddressModel
  ): Promise<AddressDocument | null> {
    return await Address.findByIdAndUpdate(_id, model, { new: true });
  }

  async findOneById(_id: string): Promise<AddressDocument | null> {
    return await Address.findOne({ _id });
  }

  async findOneByName(name: string): Promise<AddressDocument | null> {
    return await Address.findOne({ name });
  }

  async findAll(filterBy: FilterAddressByModel): Promise<AddressDocument[]> {
    return await Address.find(filterBy);
  }

  async deleteOne(_id: string): Promise<AddressDocument | null> {
    return await Address.findByIdAndRemove(_id);
  }
}
