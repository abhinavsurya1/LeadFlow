import { Router, Request, Response, NextFunction } from 'express';
import { leadsService } from '../services/leads.service';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema } from '../schemas/lead.schema';

export const leadsRouter = Router();

leadsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await leadsService.list();
    res.json(leads);
  } catch (err) {
    next(err);
  }
});

leadsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadsService.getById(req.params.id);
    res.json(lead);
  } catch (err) {
    next(err);
  }
});

leadsRouter.post('/', validate(createLeadSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadsService.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
});

leadsRouter.patch('/:id', validate(updateLeadSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await leadsService.update(req.params.id, req.body);
    res.json(lead);
  } catch (err) {
    next(err);
  }
});

leadsRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await leadsService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
