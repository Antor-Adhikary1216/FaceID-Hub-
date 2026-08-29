import mongoose from 'mongoose';
import { Profile, IProfile } from '../models/profile';
import { User } from '../models/user';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export async function createProfile(
  userId: string,
  data: Partial<IProfile>
): Promise<IProfile> {
  const existing = await Profile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  if (existing) {
    throw new AppError(409, 'Profile already exists for this user', 'CONFLICT');
  }

  const profile = await Profile.create({
    userId: new mongoose.Types.ObjectId(userId),
    bio: data.bio,
    location: data.location,
    company: data.company,
    jobTitle: data.jobTitle,
    avatar: data.avatar,
    banner: data.banner,
    isPublic: data.isPublic ?? true,
    faceEmbeddings: data.faceEmbeddings || [],
    socialProfiles: data.socialProfiles || [],
    skills: data.skills || [],
    projects: data.projects || [],
  });

  logger.info(`Profile created for user ${userId}`);
  return profile;
}

export async function getProfile(profileId: string): Promise<IProfile> {
  const profile = await Profile.findOne({
    _id: new mongoose.Types.ObjectId(profileId),
    isPublic: true,
  }).populate('userId', 'fullName email avatar');

  if (!profile) {
    throw new AppError(404, 'Profile not found', 'NOT_FOUND');
  }

  return profile;
}

export async function getMyProfile(userId: string): Promise<IProfile> {
  const profile = await Profile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).populate('userId', 'fullName email avatar');

  if (!profile) {
    throw new AppError(404, 'Profile not found. Create one first.', 'NOT_FOUND');
  }

  return profile;
}

export async function updateProfile(
  userId: string,
  data: Partial<IProfile>
): Promise<IProfile> {
  const profile = await Profile.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new AppError(404, 'Profile not found', 'NOT_FOUND');
  }

  logger.info(`Profile updated for user ${userId}`);
  return profile;
}

export async function deleteProfile(userId: string): Promise<{ success: boolean }> {
  const result = await Profile.findOneAndDelete({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!result) {
    throw new AppError(404, 'Profile not found', 'NOT_FOUND');
  }

  logger.info(`Profile deleted for user ${userId}`);
  return { success: true };
}

export async function addFaceEmbedding(
  userId: string,
  embedding: number[],
  image: string
): Promise<IProfile> {
  const profile = await Profile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!profile) {
    throw new AppError(404, 'Profile not found', 'NOT_FOUND');
  }

  profile.faceEmbeddings.push({
    embedding,
    image,
    createdAt: new Date(),
  });

  await profile.save();
  logger.info(`Face embedding added for user ${userId}`);
  return profile;
}

export async function removeFaceEmbedding(
  userId: string,
  embeddingId: string
): Promise<IProfile> {
  const profile = await Profile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!profile) {
    throw new AppError(404, 'Profile not found', 'NOT_FOUND');
  }

  const index = profile.faceEmbeddings.findIndex(
    (e) => e._id?.toString() === embeddingId
  );

  if (index === -1) {
    throw new AppError(404, 'Face embedding not found', 'NOT_FOUND');
  }

  profile.faceEmbeddings.splice(index, 1);
  await profile.save();
  logger.info(`Face embedding removed for user ${userId}`);
  return profile;
}
