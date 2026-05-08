import { Router, Request, Response, NextFunction } from 'express';
import { discussionsService } from '../services/discussions.service';
import { validate } from '../middleware/validate';
import { createDiscussionSchema } from '../schemas/discussion.schema';

export const discussionsRouter = Router({ mergeParams: true });

discussionsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discussions = await discussionsService.listByLead(req.params.leadId);
    res.json(discussions);
  } catch (err) {
    next(err);
  }
});

discussionsRouter.post('/', validate(createDiscussionSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discussion = await discussionsService.create(req.params.leadId, req.body);
    res.status(201).json(discussion);
  } catch (err) {
    next(err);
  }
});
