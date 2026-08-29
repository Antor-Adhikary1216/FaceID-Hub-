import { Request, Response, NextFunction } from 'express';
import * as searchService from '../services/search.service';
import logger from '../utils/logger';

export async function searchFaces(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No image file provided' },
      });
      return;
    }

    const userId = req.user?.userId;
    const result = await searchService.searchFaces(file.buffer, userId);

    res.json({
      success: true,
      data: {
        results: result.results,
        processingTimeMs: result.processingTimeMs,
        resultCount: result.results.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSearchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }

    const history = await searchService.getSearchHistory(userId);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}
