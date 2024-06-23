import { router } from '../api';
import { auth } from './auth';
import equipment from './equipment';
import gallery from './gallery';
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
    tags,
    gallery,
    equipment
});

export type AppRouter = typeof Router;