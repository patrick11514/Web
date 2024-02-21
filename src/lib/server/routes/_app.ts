import { router } from '../api';
import { auth } from './auth';
import { project } from './project';
import { projects } from './projects';
import { tag } from './tag';
import { upload } from './upload';

export const Router = router({
    auth,
    project,
    upload,
    tag,
    projects
});

export type AppRouter = typeof Router;
