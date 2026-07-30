import cors from 'cors';
import express from 'express';

import { router } from './routes';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

export default app;
