import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILeader extends Document {
  firstname: string;
  lastname: string;
  role: 'President' | 'VicePresident';
  photo: string;
  githubUrl?: string;
  linkedinUrl?: string;
  svgvector?: string;
  backgroundColor?: string;
}

const LeaderSchema: Schema<ILeader> = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    role: { type: String, enum: ['President', 'VicePresident'], required: true },
    photo: { type: String, required: true },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    svgvector: { type: String },
    backgroundColor: { type: String },
  },
  { timestamps: true }
);

export const LeaderModel: Model<ILeader> =
  mongoose.models.Leader || mongoose.model<ILeader>('Leader', LeaderSchema);
