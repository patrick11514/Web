import type { z } from 'zod';
import lang from './_template';

export default lang.parse({
    navigation: {
        home: 'Home'
    }
} satisfies z.infer<typeof lang>);
