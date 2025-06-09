import { router } from './api';
import login from './_routes/login';
import types from './_routes/types';
import equipment from './_routes/equipment';
import upload from './_routes/upload';
import article from './_routes/article';

export const r = router({
    login,
    types,
    equipment,
    upload,
    article
});

export type AppRouter = typeof r;
