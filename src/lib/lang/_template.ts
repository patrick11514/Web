import { z } from 'zod';

// STRING
const _ = z.string();
// OBJECT
const o = z.object;
// RICH TEXT
export const r = z.array(
    z.string().or(
        o({
            link: z.string(),
            text: z.string()
        })
    )
);

export default o({
    default_desc: _,
    navigation: o({
        home: _,
        home_desc: _,
        gallery: _,
        gallery_desc: _
    }),
    main: o({
        age: _,
        text: r
    })
});
