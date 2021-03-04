import { injectable, inject } from 'inversify';
import { StoreDocument } from '../database/models/store.model';
import { OrganisationRepository } from '../database/repositories/organisation.repository';
import { StoreRepository } from '../database/repositories/store.repository';
import {
  CreateStoreModel,
  FilterStoreByModel
} from '../domain/interfaces/store';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface StoreService {
  createOne(model: CreateStoreModel): Promise<StoreDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateStoreModel
  ): Promise<StoreDocument | null>;
  findOneById(_id: string): Promise<StoreDocument | null>;
  findAll(filterBy: FilterStoreByModel): Promise<StoreDocument[]>;
  deleteOne(_id: string): Promise<StoreDocument | null>;
}

@injectable()
export class StoreServiceImpl implements StoreService {
  private storeRepository: StoreRepository;
  private organisationRepository: OrganisationRepository;

  constructor(
    @inject(TYPES.StoreRepository)
    storeRepository: StoreRepository,
    @inject(TYPES.OrganisationRepository)
    organisationRepository: OrganisationRepository
  ) {
    this.storeRepository = storeRepository;
    this.organisationRepository = organisationRepository;
  }

  private async isStoreNameTaken(name: string): Promise<boolean> {
    return (await this.storeRepository.findOneByName(name))
      ? Promise.resolve(true)
      : Promise.resolve(false);
  }

  async createOne(model: CreateStoreModel): Promise<StoreDocument> {
    try {
      // check if store name exists
      if (await this.isStoreNameTaken(model.name)) {
        throw new Error('Store with the given name already exists');
      }

      const store = await this.storeRepository.createOne(model);

      // add store id to organisation store document
      await this.organisationRepository.findOneByIdAndAddToKey(
        store.organisation,
        'stores',
        (store._id as unknown) as string
      );

      return store;
    } catch (error) {
      if (error.code === 11000) {
        error.message = `Store with the given name already exists`;
      }
      logger.error(
        `[StoreService: createOne]: Unabled to create a new store: ${error}`
      );
      throw error;
    }
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateStoreModel
  ): Promise<StoreDocument | null> {
    try {
      const store = await this.storeRepository.findOneByIdAndUpdate(_id, model);
      // check if store document is returned
      if (!store) {
        throw new Error('Store with the given id was not found');
      }
      return store;
    } catch (error) {
      logger.error(
        `[StoreService: findOneByIdAndUpdate]: Unabled to update store: ${error}`
      );
      throw error;
    }
  }

  async findOneById(_id: string): Promise<StoreDocument | null> {
    try {
      const store = await this.storeRepository.findOneById(_id);
      // check if store document is returned
      if (!store) {
        throw new Error('Store with the given id was not found');
      }
      return store;
    } catch (error) {
      logger.error(`[StoreService: findOne]: Unable to find store: ${error}`);
      throw error;
    }
  }

  async findAll(filterBy: FilterStoreByModel): Promise<StoreDocument[]> {
    try {
      return await this.storeRepository.findAll(filterBy);
    } catch (error) {
      logger.error(`[StoreService: findAll]: Unable to find stores: ${error}`);
      throw error;
    }
  }

  async deleteOne(_id: string): Promise<StoreDocument | null> {
    try {
      const store = await this.storeRepository.deleteOne(_id);
      // check if deleted store document is returned
      if (!store) {
        throw new Error('Store with the given id was not found');
      }

      // remove store id from organisation store document
      await this.organisationRepository.findOneByIdAndPullFromKey(
        store.organisation,
        'stores',
        (store._id as unknown) as string
      );

      return store;
    } catch (error) {
      logger.error(
        `[StoreService: deleteOne]: Unabled to delete store: ${error}`
      );
      throw error;
    }
  }
}
