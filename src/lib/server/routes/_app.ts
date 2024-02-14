import { router } from '../api';
import { auth } from './auth';
import { project } from './project';
import { tag } from './tag';
import { upload } from './upload';

export const Router = router({
    auth,
    project,
    upload,
    tag
});

export type AppRouter = typeof Router;
