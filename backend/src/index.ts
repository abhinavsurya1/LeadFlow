import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';

// Route imports will be added in later commits
import { leadsRouter } from './routes/leads';
import { discussionsRouter } from './routes/discussions';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route mounts will be added here
app.use('/api/leads', leadsRouter);
app.use('/api/leads/:leadId/discussions', discussionsRouter);

// Centralized error handler MUST be the last middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
