import { z } from 'zod';

const _ = z.string();
const o = z.object;

export default o({
    default_desc: _,
    navigation: o({
        home: _,
        home_desc: _,
        gallery: _,
        gallery_desc: _
    })
});
