import { Request, Response } from 'express';
import { LessonService } from '../services/lessons.service';
import { QueryParams } from '../../../common/interfaces/interfaces';

export class LessonController {
  private service: LessonService;

  constructor() {
    this.service = new LessonService();
  }

  async getLessons(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query as QueryParams;
      const lessons = await this.service.getLessons(query);
      res.json(lessons);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
}

