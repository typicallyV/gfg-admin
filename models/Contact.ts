import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  title: string;
  description: string;
}

const ContactSchema: Schema<IContact> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Your personal name is required.'],
    },
    email: {
      type: String,
      required: [true, 'A valid email address is required to contact us.'],
    },
    title: {
      type: String,
      required: [true, 'A title or subject for your message is required.'],
      minlength: [5, 'The title should be at least 5 characters long.'],
      maxlength: [100, 'The title cannot exceed 100 characters in length.'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description of your inquiry.'],
      minlength: [20, 'Your message should be at least 20 characters long.'],
      maxlength: [2000, 'Your message cannot exceed 2000 characters in length.'],
    },
  },
  {
    timestamps: true,
  }
);

export const ContactModel: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
