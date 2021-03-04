import { injectable } from 'inversify';
import { ObjectId } from 'mongoose';
import { CreateOrganisationModel } from '../../domain/interfaces/organisation';
import Organisation, {
  OrganisationDocument
} from '../models/organisation.model';

export interface OrganisationRepository {
  createOne(model: CreateOrganisationModel): Promise<OrganisationDocument>;
  findOneByIdAndUpdate(
    _id: string,
    model: CreateOrganisationModel
  ): Promise<OrganisationDocument | null>;
  findOneByIdAndAddToKey(
    _id: string,
    key: string,
    value: string
  ): Promise<OrganisationDocument | null>;
  findOneByIdAndPullFromKey(
    _id: string,
    key: string,
    value: ObjectId | string
  ): Promise<OrganisationDocument | null>;
  findOneById(_id: string): Promise<OrganisationDocument | null>;
  findAll(): Promise<OrganisationDocument[]>;
  deleteOne(_id: string): Promise<OrganisationDocument | null>;
}

@injectable()
export class OrganisationRepositoryImpl implements OrganisationRepository {
  async createOne(
    model: CreateOrganisationModel
  ): Promise<OrganisationDocument> {
    const organisation = new Organisation(model);
    return await organisation.save();
  }

  async findOneByIdAndUpdate(
    _id: string,
    model: CreateOrganisationModel
  ): Promise<OrganisationDocument | null> {
    return await Organisation.findByIdAndUpdate(_id, model, { new: true });
  }

  async findOneByIdAndAddToKey(
    _id: string,
    key: string,
    value: ObjectId | string
  ): Promise<OrganisationDocument | null> {
    return await Organisation.findByIdAndUpdate(
      _id,
      { $addToSet: { [key]: value } },
      { new: true }
    );
  }

  async findOneByIdAndPullFromKey(
    _id: string,
    key: string,
    value: ObjectId | string
  ): Promise<OrganisationDocument | null> {
    return await Organisation.findByIdAndUpdate(
      _id,
      { $pull: { [key]: value } },
      { new: true }
    );
  }

  async findOneById(_id: string): Promise<OrganisationDocument | null> {
    return await Organisation.findOne({ _id });
  }

  async findAll(): Promise<OrganisationDocument[]> {
    return await Organisation.find();
  }

  async deleteOne(_id: string): Promise<OrganisationDocument | null> {
    return await Organisation.findByIdAndRemove(_id);
  }
}
