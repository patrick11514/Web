import { router } from './api';
import login from './_routes/login';
import types from './_routes/types';
import equipment from './_routes/equipment';

export const r = router({
    login,
    types,
    equipment
});

export type AppRouter = typeof r;
