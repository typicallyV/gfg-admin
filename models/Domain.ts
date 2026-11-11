import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IMember {
  _id?: Types.ObjectId | string;
  firstname: string;
  lastname: string;
  role: string;
  photo: string;
  githubUrl?: string;
  linkedinUrl: string;
  svgvector?: string;
  backgroundColor?: string;
}

export type IMemberSubdocument = Types.Subdocument & IMember;

export interface IDomain extends Document {
  name: string;
  members: Types.DocumentArray<IMemberSubdocument>;
}

const MemberSchema: Schema<IMember> = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role: { type: String, required: true },
  photo: { type: String, required: true },
  githubUrl: { type: String },
  linkedinUrl: { type: String, required: true },
  svgvector: { type: String },
  backgroundColor: { type: String },
});

const DomainSchema: Schema<IDomain> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    members: [MemberSchema],
  },
  { timestamps: true }
);

export const DomainModel: Model<IDomain> =
  mongoose.models.Domain || mongoose.model<IDomain>('Domain', DomainSchema);

