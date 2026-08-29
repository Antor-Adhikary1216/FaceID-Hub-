import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { profileUpload } from '../middleware/upload';
import { createProfileSchema, updateProfileSchema } from '../validators/profile.validator';

const router = Router();

router.post('/', authenticate, validate(createProfileSchema), profileController.createProfile);
router.get('/me', authenticate, profileController.getMyProfile);
router.get('/:id', profileController.getProfile);
router.put('/', authenticate, validate(updateProfileSchema), profileController.updateProfile);
router.delete('/', authenticate, profileController.deleteProfile);
router.post('/face', authenticate, profileUpload.single('image'), profileController.addFaceEmbed);
router.delete('/face/:embeddingId', authenticate, profileController.removeFaceEmbed);

export default router;
