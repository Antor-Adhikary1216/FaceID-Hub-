import mongoose from 'mongoose';
import { Profile, IProfile } from '../models/profile';
import { SearchRequest } from '../models/search';
import { env } from '../config';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function getConfidenceLevel(similarity: number): string {
  if (similarity >= 0.9) return 'very_high';
  if (similarity >= 0.75) return 'high';
  if (similarity >= 0.6) return 'medium';
  if (similarity >= 0.4) return 'low';
  return 'very_low';
}

interface SearchResult {
  profileId: string;
  similarity: number;
  confidence: string;
  profile?: IProfile;
}

export async function searchFaces(
  imageBuffer: Buffer,
  userId?: string
): Promise<{ results: SearchResult[]; processingTimeMs: number }> {
  const startTime = Date.now();

  let embeddingResponse: { embedding: number[] };
  try {
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('file', blob, 'search.jpg');

    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/embed`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`AI service responded with status ${response.status}`);
    }

    embeddingResponse = (await response.json()) as { embedding: number[] };
  } catch (error) {
    logger.error('Failed to get embedding from AI service:', error);
    throw new AppError(502, 'AI service unavailable', 'AI_SERVICE_ERROR');
  }

  const searchEmbedding = embeddingResponse.embedding;
  if (!searchEmbedding || searchEmbedding.length === 0) {
    throw new AppError(422, 'Could not generate embedding from image', 'EMBEDDING_ERROR');
  }

  const profiles = await Profile.find({
    isPublic: true,
    'faceEmbeddings.0': { $exists: true },
  });

  const results: SearchResult[] = [];

  for (const profile of profiles) {
    for (const faceEmbed of profile.faceEmbeddings) {
      const similarity = cosineSimilarity(searchEmbedding, faceEmbed.embedding);
      if (similarity >= 0.4) {
        results.push({
          profileId: profile._id.toString(),
          similarity: Math.round(similarity * 10000) / 10000,
          confidence: getConfidenceLevel(similarity),
          profile,
        });
      }
    }
  }

  results.sort((a, b) => b.similarity - a.similarity);
  const topResults = results.slice(0, 10);

  const processingTimeMs = Date.now() - startTime;

  const searchRequest = await SearchRequest.create({
    userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
    searchImage: `buffer:${imageBuffer.length}bytes`,
    results: topResults.map((r) => ({
      profileId: new mongoose.Types.ObjectId(r.profileId),
      similarity: r.similarity,
      confidence: r.confidence,
    })),
    status: 'completed',
    processingTimeMs,
  });

  logger.info(`Face search completed: ${topResults.length} results in ${processingTimeMs}ms`);

  return {
    results: topResults.map(({ profile, ...rest }) => rest),
    processingTimeMs,
  };
}

export async function getSearchHistory(userId: string) {
  const requests = await SearchRequest.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .limit(50);

  return requests;
}
