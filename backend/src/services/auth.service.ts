import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, IUser } from '../models/user';
import { Profile } from '../models/profile';
import { env } from '../config';
import { verifyFirebaseIdToken } from '../config/firebase';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function generateTokens(user: IUser): TokenPair {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(
    { userId: user._id.toString(), tokenVersion: 0 },
    env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

function sanitizeUser(user: IUser) {
  const obj = user.toObject();
  delete obj.passwordHash;
  return obj;
}

export async function register(
  email: string,
  password: string,
  fullName: string
): Promise<{ user: ReturnType<typeof sanitizeUser>; tokens: TokenPair }> {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError(409, 'Email already registered', 'CONFLICT');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    fullName,
    role: 'user',
    isActive: true,
  });

  await Profile.create({
    userId: user._id,
    bio: null,
    location: null,
    company: null,
    jobTitle: null,
    isPublic: true,
    faceEmbeddings: [],
    socialProfiles: [],
    skills: [],
    projects: [],
  });

  const tokens = generateTokens(user);
  logger.info(`User registered: ${user.email}`);

  return { user: sanitizeUser(user), tokens };
}

export async function login(
  email: string,
  password: string
): Promise<{ user: ReturnType<typeof sanitizeUser>; tokens: TokenPair }> {
  const user = await User.findOne({ email: email.toLowerCase(), deletedAt: null });
  if (!user) {
    throw new AppError(401, 'Invalid email or password', 'UNAUTHORIZED');
  }

  if (!user.isActive) {
    throw new AppError(403, 'Account is deactivated', 'FORBIDDEN');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new AppError(401, 'Invalid email or password', 'UNAUTHORIZED');
  }

  const tokens = generateTokens(user);
  logger.info(`User logged in: ${user.email}`);

  return { user: sanitizeUser(user), tokens };
}

export async function refreshToken(
  token: string
): Promise<{ user: ReturnType<typeof sanitizeUser>; tokens: TokenPair }> {
  let decoded: { userId: string; tokenVersion: number };
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; tokenVersion: number };
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token', 'UNAUTHORIZED');
  }

  const user = await User.findOne({ _id: decoded.userId, deletedAt: null });
  if (!user) {
    throw new AppError(401, 'User not found', 'UNAUTHORIZED');
  }

  if (!user.isActive) {
    throw new AppError(403, 'Account is deactivated', 'FORBIDDEN');
  }

  const tokens = generateTokens(user);
  return { user: sanitizeUser(user), tokens };
}

export async function logout(_userId: string): Promise<{ success: boolean }> {
  return { success: true };
}

export async function verifyFirebaseToken(
  idToken: string
): Promise<{ user: ReturnType<typeof sanitizeUser>; tokens: TokenPair }> {
  let decoded: import('firebase-admin/auth').DecodedIdToken;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch (error) {
    throw new AppError(401, 'Invalid Firebase token', 'UNAUTHORIZED');
  }

  let user = await User.findOne({ firebaseUid: decoded.uid });

  if (!user) {
    user = await User.create({
      email: decoded.email || `${decoded.uid}@firebase.local`,
      passwordHash: await bcrypt.hash(uuidv4(), SALT_ROUNDS),
      fullName: decoded.name || decoded.email || 'Firebase User',
      role: 'user',
      isActive: true,
      firebaseUid: decoded.uid,
      avatar: decoded.picture || null,
    });

    await Profile.create({
      userId: user._id,
      isPublic: true,
      faceEmbeddings: [],
      socialProfiles: [],
      skills: [],
      projects: [],
    });

    logger.info(`New Firebase user created: ${user.email}`);
  }

  const tokens = generateTokens(user);
  return { user: sanitizeUser(user), tokens };
}

export async function getMe(userId: string) {
  const user = await User.findOne({ _id: userId, deletedAt: null });
  if (!user) {
    throw new AppError(404, 'User not found', 'NOT_FOUND');
  }

  const profile = await Profile.findOne({ userId: user._id });

  return {
    user: sanitizeUser(user),
    profile,
  };
}
