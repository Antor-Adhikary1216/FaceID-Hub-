import { Request, Response, NextFunction } from 'express';
import * as profileService from '../services/profile.service';
import logger from '../utils/logger';

export async function createProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }
    const profile = await profileService.createProfile(userId, req.body);

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const profile = await profileService.getProfile(id);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }
    const profile = await profileService.getMyProfile(userId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }
    const profile = await profileService.updateProfile(userId, req.body);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }
    const result = await profileService.deleteProfile(userId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function addFaceEmbed(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No image file provided' } });
      return;
    }

    let embedding: number[] = [];
    try {
      const formData = new FormData();
      const blob = new Blob([file.buffer], { type: file.mimetype });
      formData.append('file', blob, file.originalname);

      const aiResponse = await fetch(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/api/v1/embed`, {
        method: 'POST',
        body: formData,
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json() as { embedding: number[] };
        embedding = data.embedding;
      }
    } catch (err) {
      logger.warn('AI service unavailable, storing embedding as empty array');
    }

    const profile = await profileService.addFaceEmbedding(userId, embedding, file.originalname);

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeFaceEmbed(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }
    const { embeddingId } = req.params;
    const profile = await profileService.removeFaceEmbedding(userId, embeddingId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}
