import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose';

export interface ITeamLeader extends Document {
  name: string;
  email: string;
  contactNo: string;
  githubUrl?: string;
  linkedinUrl?: string;
  section?: string;
  year?: number;
  rollNo?: string;
  collegeName: string;
}

export interface ITeamMember extends Document {
  name: string;
  email: string;
  contactNo: string;
  githubUrl?: string;
  linkedinUrl?: string;
  section?: string;
  year?: number;
  rollNo?: string;
  collegeName: string;
}

export interface IPayment extends Document {
  paymentId?: string;
  imageUrl?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface IRegistration extends Document {
  eventId: ObjectId;
  teamName: string;
  teamLeader: ITeamLeader;
  teamMembers: ITeamMember[];
  payment: IPayment;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const TeamLeaderSchema: Schema<ITeamLeader> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    section: { type: String },
    year: { type: Number },
    rollNo: { type: String },
    collegeName: { type: String, required: true, default: 'RBU' },
  },
  { _id: false }
);

const TeamMemberSchema: Schema<ITeamMember> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    section: { type: String },
    year: { type: Number },
    rollNo: { type: String },
    collegeName: { type: String, required: true, default: 'RBU' },
  },
  { _id: false }
);

const PaymentSchema: Schema<IPayment> = new mongoose.Schema(
  {
    paymentId: { type: String },
    imageUrl: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  { _id: false }
);

const RegistrationSchema: Schema<IRegistration> = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Event' },
    teamName: { type: String, required: true },
    teamLeader: { type: TeamLeaderSchema, required: true },
    teamMembers: { type: [TeamMemberSchema], required: true, default: [] },
    payment: { type: PaymentSchema, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

RegistrationSchema.index({ eventId: 1, teamName: 1 }, { unique: true });

export const RegistrationModel: Model<IRegistration> =
  mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);