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
        gallery: _,
        admin: _
    }),
    error: o({
        title: _,
        message: _,
        sub_message: _,
        go_home: _
    }),
    main: o({
        age: _,
        text: r
    }),
    admin: o({
        login: o({
            title: _,
            username: _,
            password: _,
            submit: _
        })
    }),
    errors: o({
        login: o({
            form: _,
            username: _,
            password: _
        })
    })
});
