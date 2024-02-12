import { APIServer } from '@patrick115/sveltekitapi';
import { createContext } from './context';
import { Router } from './routes/_app';

export const Server = new APIServer({
    router: Router,
    context: createContext,
    path: '/api'
});
