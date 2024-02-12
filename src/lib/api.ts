import { createAPIClient } from '@patrick115/sveltekitapi';
import type { AppRouter } from './server/routes/_app';

export const API = createAPIClient<AppRouter>('/api');
