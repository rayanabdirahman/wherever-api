import express from 'express';
import { inject, injectable } from 'inversify';
import config from '../../config';
import { CreateOrganisationModel } from '../../domain/interfaces/organisation';
import { OrganisationService } from '../../services/organisation.service';
import TYPES from '../../types';
import ApiResponse from '../../utilities/api-response';
import logger from '../../utilities/logger';
import { RegistrableController } from '../registrable.controller';
import OrganisationValidator from './organisation.validator';

@injectable()
export default class OrganisationController implements RegistrableController {
  private organisationService: OrganisationService;

  constructor(
    @inject(TYPES.OrganisationService) organisationService: OrganisationService
  ) {
    this.organisationService = organisationService;
  }

  registerRoutes(app: express.Application): void {
    app.post(`${config.API_URL}/organisations`, this.createOne);
    app.put(`${config.API_URL}/organisations/:_id`, this.updateOne);
    app.get(`${config.API_URL}/organisations/:_id`, this.findOne);
    app.get(`${config.API_URL}/organisations`, this.findAll);
    app.delete(`${config.API_URL}/organisations/:_id`, this.deleteOne);
  }

  createOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const model: CreateOrganisationModel = {
        ...req.body
      };

      // validate request body
      const validity = OrganisationValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const organisation = await this.organisationService.createOne(model);
      return ApiResponse.success(res, organisation);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[OrganisationController: createOne] - Unable to create a new organisation: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  updateOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const model: CreateOrganisationModel = {
        ...req.body
      };

      // validate request body
      const validity = OrganisationValidator.createOne(model);
      if (validity.error) {
        const { message } = validity.error;
        return ApiResponse.error(res, message);
      }

      const organisation = await this.organisationService.findOneByIdAndUpdate(
        _id,
        model
      );
      return ApiResponse.success(res, organisation);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[OrganisationController: updateOne] - Unable to find organisation: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const organisation = await this.organisationService.findOneById(_id);
      return ApiResponse.success(res, organisation);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[OrganisationController: findOne] - Unable to find organisation: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };

  findAll = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const organisations = await this.organisationService.findAll();
      return ApiResponse.success(res, organisations);
    } catch (error) {
      const { message } = error;
      logger.error(
        `[OrganisationController: findAll] - Unable to find organisations: ${message}`
      );
      return ApiResponse.error(res, error);
    }
  };

  deleteOne = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { _id } = req.params;
      const organisation = await this.organisationService.deleteOne(_id);
      return ApiResponse.success(res, organisation);
    } catch (error) {
      const message = error.message || error;
      logger.error(
        `[OrganisationController: deleteOne] - Unable to delete organisation: ${message}`
      );
      return ApiResponse.error(res, message);
    }
  };
}
