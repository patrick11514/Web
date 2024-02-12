import { router } from './api';
import { login } from './routes/login';

export const Router = router({
    login
});

export type AppRouter = typeof Router;
