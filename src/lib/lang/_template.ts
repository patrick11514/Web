import { z } from 'zod';

const _ = z.string();
const o = z.object;

export default o({
    navigation: o({
        home: _
    })
});
