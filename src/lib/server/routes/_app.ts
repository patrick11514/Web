import { router } from '../api';
import { auth } from './auth';
import { project } from './project';
import { upload } from './upload';

export const Router = router({
    auth,
    project,
    upload
});

export type AppRouter = typeof Router;
