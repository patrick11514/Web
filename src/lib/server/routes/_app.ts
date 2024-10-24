import { router } from '../api';
import { auth } from './auth';
import details from './details';
import equipment from './equipment';
import gallery from './gallery/index';
import { project } from './project';
import { projects } from './projects';
import stats from './stats';
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
    equipment,
    stats,
    details
});

export type AppRouter = typeof Router;
