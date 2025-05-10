import { router } from './api';
import login from './_routes/login';
import types from './_routes/types';

export const r = router({
    login,
    types
});

export type AppRouter = typeof r;
