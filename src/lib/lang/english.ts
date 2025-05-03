import type { z } from 'zod';
import lang from './_template';

export default lang.parse({
    navigation: {
        home: 'Home',
        home_desc: 'Here you can learn more about me, my interests and the projects I am working on.'
    }
} satisfies z.infer<typeof lang>);
