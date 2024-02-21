import { router } from '../api';
import { auth } from './auth';
import { project } from './project';
import { projects } from './projects';
import { tag } from './tag';
import { tags } from './tags';
import { upload } from './upload';

export const Router = router({
    auth,
    project,
    projects,
    upload,
    tag,
    tags
});

export type AppRouter = typeof Router;
