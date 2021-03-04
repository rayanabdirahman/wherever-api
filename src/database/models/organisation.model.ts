import mongoose, { Schema } from 'mongoose';

export interface OrganisationDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  members?: string[];
  stores?: string[];
}

const OrganisationSchema: mongoose.Schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  stores: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model<OrganisationDocument>(
  'Organisation',
  OrganisationSchema
);
