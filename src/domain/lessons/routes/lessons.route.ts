import { Router } from 'express';
import { LessonController } from '../controllers/lessons.controller';

const router = Router();
const controller = new LessonController();

router.get('/', (req, res) => controller.getLessons(req, res));

export default router;
