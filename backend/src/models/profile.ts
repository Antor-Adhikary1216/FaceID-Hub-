import mongoose, { Schema, Document } from 'mongoose';

export interface IFaceEmbedding {
  _id?: mongoose.Types.ObjectId;
  embedding: number[];
  image: string;
  createdAt: Date;
}

export interface ISocialProfile {
  _id?: mongoose.Types.ObjectId;
  platform: string;
  url?: string;
  username?: string;
}

export interface ISkill {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category?: string;
}

export interface IProject {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  bio?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  avatar?: string;
  banner?: string;
  isPublic: boolean;
  faceEmbeddings: IFaceEmbedding[];
  socialProfiles: ISocialProfile[];
  skills: ISkill[];
  projects: IProject[];
  createdAt: Date;
  updatedAt: Date;
}

const faceEmbeddingSchema = new Schema<IFaceEmbedding>({
  embedding: { type: [Number], required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const socialProfileSchema = new Schema<ISocialProfile>({
  platform: { type: String, required: true },
  url: { type: String, default: null },
  username: { type: String, default: null },
});

const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  category: { type: String, default: null },
});

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, default: null },
  url: { type: String, default: null },
  imageUrl: { type: String, default: null },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
});

const profileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, default: null },
    location: { type: String, default: null },
    company: { type: String, default: null },
    jobTitle: { type: String, default: null },
    avatar: { type: String, default: null },
    banner: { type: String, default: null },
    isPublic: { type: Boolean, default: true },
    faceEmbeddings: [faceEmbeddingSchema],
    socialProfiles: [socialProfileSchema],
    skills: [skillSchema],
    projects: [projectSchema],
  },
  {
    timestamps: true,
  }
);

profileSchema.index({ userId: 1 }, { unique: true });
profileSchema.index({ isPublic: 1 });

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
