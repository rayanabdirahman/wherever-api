import { injectable } from 'inversify';
import {
  CreateStoreModel,
  FilterStoreByModel
} from '../../domain/interfaces/store';
import Store, { StoreDocument } from '../models/store.model';

export interface StoreRepository {
  createOne(model: CreateStoreModel): Promise<StoreDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateStoreModel
  ): Promise<StoreDocument | null>;
  findOneById(_id: string): Promise<StoreDocument | null>;
  findOneByName(email: string): Promise<StoreDocument | null>;
  findAll(filterBy: FilterStoreByModel): Promise<StoreDocument[]>;
  deleteOne(_id: string): Promise<StoreDocument | null>;
}

@injectable()
export class StoreRepositoryImpl implements StoreRepository {
  async createOne(model: CreateStoreModel): Promise<StoreDocument> {
    const store = new Store(model);
    return await store.save();
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateStoreModel
  ): Promise<StoreDocument | null> {
    return await Store.findByIdAndUpdate(_id, model, { new: true });
  }

  async findOneById(_id: string): Promise<StoreDocument | null> {
    return await Store.findOne({ _id });
  }

  async findOneByName(name: string): Promise<StoreDocument | null> {
    return await Store.findOne({ name });
  }

  async findAll(filterBy: FilterStoreByModel): Promise<StoreDocument[]> {
    return await Store.find(filterBy);
  }

  async deleteOne(_id: string): Promise<StoreDocument | null> {
    return await Store.findByIdAndRemove(_id);
  }
}
