import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  shortDescription: string;
  image: {
    url: string;
    publicId: string;
  };
  gallery: { url: string; publicId: string }[];
  startDate: Date;
  endDate: Date;
  venue: string;
  type: 'solo' | 'team';
  theme: string;
  audience: 'rbu' | 'intercollege' | 'both';
  teamSize?: {
    min: number;
    max: number;
  };
  pricing?: {
    rbu?: {
      isPaid: boolean;
      fee: number;
      qrCode?: { url: string; publicId: string };
    };
    intercollege?: {
      isPaid: boolean;
      fee: number;
      qrCode?: { url: string; publicId: string };
    };
  };
  registrationFee: number;
  registrationsCount: number;
  registrationStatus: 'open' | 'closed';
}

const EventSchema: Schema<IEvent> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [100, 'Event name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [60, 'Description cannot exceed 60 characters'],
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    gallery: [
      {
        url: String,
        publicId: String,
      },
    ],
    startDate: {
      type: Date,
      required: [true, 'Event start date and time is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Event end date and time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
      maxlength: [200, 'Venue cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: ['solo', 'team'],
      required: [true, 'Event type is required'],
    },
    theme: {
      type: String,
      required: [true, 'Event theme is required'],
    },
    audience: {
      type: String,
      enum: ['rbu', 'intercollege', 'both'],
    },
    teamSize: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 1 },
    },
    pricing: {
      rbu: {
        isPaid: { type: Boolean, default: false },
        fee: { type: Number, default: 0, min: 0 },
        qrCode: {
          url: String,
          publicId: String,
        },
      },
      intercollege: {
        isPaid: { type: Boolean, default: false },
        fee: { type: Number, default: 0, min: 0 },
        qrCode: {
          url: String,
          publicId: String,
        },
      },
    },
    registrationFee: {
      type: Number,
      default: 0,
      min: [0, 'Fee cannot be negative'],
    },
    registrationsCount: {
      type: Number,
      default: 0,
      min: [0, 'Registrations count cannot be negative'],
    },
    registrationStatus: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

export const EventModel: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
