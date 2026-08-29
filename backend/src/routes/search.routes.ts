import { Router } from 'express';
import * as searchController from '../controllers/search.controller';
import { authenticate } from '../middleware/auth';
import { searchUpload } from '../middleware/upload';
import { searchLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', searchLimiter, searchUpload.single('image'), searchController.searchFaces);
router.get('/history', authenticate, searchController.getSearchHistory);

export default router;
