import ai from './_routes/ai';
import article from './_routes/article';
import equipment from './_routes/equipment';
import login from './_routes/login';
import types from './_routes/types';
import upload from './_routes/upload';
import { router } from './api';

export const r = router({
  login,
  types,
  equipment,
  upload,
  article,
  ai
});

export type AppRouter = typeof r;
