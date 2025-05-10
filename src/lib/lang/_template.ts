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
        admin: _,
        login: _
    }),
    adminNavigation: o({
        home: _
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
        }),
        main: o({
            stats: _,
            today: _,
            week: _
        }),
        equipment: o({
            types: o({
                title: _,
                translateKey: _,
                actions: _,
                placeholder: _,
                button: _,
                success: _,
                empty: _,
                editSuccess: _,
                deleteSuccess: _,
                edit: o({
                    title: _,
                    button: _
                })
            })
        })
    }),
    errors: o({
        internal: _,
        login: o({
            form: _,
            username: _,
            password: _
        }),
        equipment: o({
            form: _,
            empty: _
        })
    }),
    equipmentType: o({
        telescope: _,
        camera: _,
        mount: _,
        filter: _,
        barlow: _,
        reducer: _,
        guidescope: _
    })
});
