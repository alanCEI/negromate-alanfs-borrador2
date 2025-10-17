import express from 'express';
import { getContentBySection } from '../controllers/content.controller.js';

const router = express.Router();

router.get('/:sectionName', getContentBySection);

export default router;