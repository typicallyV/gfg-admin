import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMentor extends Document {
  firstname: string;
  lastname: string;
  role: string;
  photo: string;
  githubUrl?: string;
  linkedinUrl?: string;
  svgvector?: string;
  backgroundColor?: string;
}

const MentorSchema: Schema<IMentor> = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    role: { type: String, required: true, default: 'Mentor' },
    photo: { type: String, required: true },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    svgvector: { type: String },
    backgroundColor: { type: String },
  },
  { timestamps: true }
);

export const MentorModel: Model<IMentor> =
  mongoose.models.Mentor || mongoose.model<IMentor>('Mentor', MentorSchema);
