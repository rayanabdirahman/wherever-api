import { injectable, inject } from 'inversify';
import { OrganisationDocument } from '../database/models/organisation.model';
import { OrganisationRepository } from '../database/repositories/organisation.repository';
import { CreateOrganisationModel } from '../domain/interfaces/organisation';
import TYPES from '../types';
import logger from '../utilities/logger';

export interface OrganisationService {
  createOne(model: CreateOrganisationModel): Promise<OrganisationDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateOrganisationModel
  ): Promise<OrganisationDocument | null>;
  findOneById(_id: string): Promise<OrganisationDocument | null>;
  findAll(): Promise<OrganisationDocument[]>;
  deleteOne(_id: string): Promise<OrganisationDocument | null>;
}

@injectable()
export class OrganisationServiceImpl implements OrganisationService {
  private organisationRepository: OrganisationRepository;

  constructor(
    @inject(TYPES.OrganisationRepository)
    organisationRepository: OrganisationRepository
  ) {
    this.organisationRepository = organisationRepository;
  }

  async createOne(
    model: CreateOrganisationModel
  ): Promise<OrganisationDocument> {
    try {
      const organisation = await this.organisationRepository.createOne(model);
      // check if organisation document is returned
      if (!organisation) {
        throw new Error(
          'Organisation with the given details can not be created'
        );
      }
      return organisation;
    } catch (error) {
      if (error.code === 11000) {
        error.message = `Organisation with the given name already exists`;
      }
      logger.error(
        `[OrganisationService: createOne]: Unabled to create a new organisation: ${error}`
      );
      throw error;
    }
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateOrganisationModel
  ): Promise<OrganisationDocument | null> {
    try {
      const organisation = await this.organisationRepository.findOneByIdAndUpdate(
        _id,
        model
      );
      // check if organisation document is returned
      if (!organisation) {
        throw new Error('Organisation with the given id was not found');
      }
      return organisation;
    } catch (error) {
      logger.error(
        `[OrganisationService: findOneByIdAndUpdate]: Unabled to update organisation: ${error}`
      );
      throw error;
    }
  }

  async findOneById(_id: string): Promise<OrganisationDocument | null> {
    try {
      const organisation = await this.organisationRepository.findOneById(_id);
      // check if organisation document is returned
      if (!organisation) {
        throw new Error('Organisation with the given id was not found');
      }
      return organisation;
    } catch (error) {
      logger.error(
        `[OrganisationService: findOne]: Unable to find organisation: ${error}`
      );
      throw error;
    }
  }

  async findAll(): Promise<OrganisationDocument[]> {
    try {
      return await this.organisationRepository.findAll();
    } catch (error) {
      logger.error(
        `[OrganisationService: findAll]: Unable to find organisations: ${error}`
      );
      throw error;
    }
  }

  async deleteOne(_id: string): Promise<OrganisationDocument | null> {
    try {
      const organisation = await this.organisationRepository.deleteOne(_id);
      // check if deleted organisation document is returned
      if (!organisation) {
        throw new Error('Organisation with the given id was not found');
      }
      return organisation;
    } catch (error) {
      logger.error(
        `[OrganisationService: deleteOne]: Unabled to delete organisation: ${error}`
      );
      throw error;
    }
  }
}
