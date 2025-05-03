import type { z } from 'zod';
import lang from './_template';

export default lang.parse({
    navigation: {
        home: 'Domů',
        home_desc: 'Zde se dozvíš více o mně, mých zájmech a projektech, na kterých pracuji.'
    }
} satisfies z.infer<typeof lang>);
