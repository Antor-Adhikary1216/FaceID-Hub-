export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  user: User;
  bio?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  banner?: string;
  avatar?: string;
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialProfile[];
  faceEmbeddings: FaceEmbedding[];
  isPublic: boolean;
  allowMatching: boolean;
  followersCount: number;
  projectsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FaceEmbedding {
  id: string;
  profileId: string;
  imageUrl: string;
  embedding: number[];
  createdAt: string;
}

export interface SocialProfile {
  platform: string;
  url: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  githubUrl?: string;
}

export interface SearchResult {
  id: string;
  profile: Profile;
  similarity: number;
  matchedAt: string;
}

export interface SearchRequest {
  image: File;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ProfileFormData {
  bio?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  isPublic: boolean;
  allowMatching: boolean;
  skills: string[];
  socialLinks: SocialProfile[];
  banner?: File;
  avatar?: File;
}
