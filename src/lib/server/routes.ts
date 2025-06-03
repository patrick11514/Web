import { router } from './api';
import login from './_routes/login';
import types from './_routes/types';
import equipment from './_routes/equipment';
import upload from './_routes/upload';

export const r = router({
    login,
    types,
    equipment,
    upload
});

export type AppRouter = typeof r;
