import { extensions } from '$/types/types';
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

export const _extensions = extensions.map((ext) => `.${ext}`).join(', ');

export default o({
    default_desc: _,
    yes: _,
    no: _,
    navigation: o({
        home: _,
        gallery: _,
        admin: _,
        login: _
    }),
    adminNavigation: o({
        home: _,
        equipment: _,
        articles: _
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
            actions: _,
            types: o({
                title: _,
                addTitle: _,
                translateKey: _,
                placeholder: _,
                button: _,
                success: _,
                empty: _,
                editSuccess: _,
                deleteSuccess: _,
                edit: o({
                    title: _,
                    button: _
                }),
                delete: o({
                    question: _
                })
            }),
            equipment: o({
                title: _,
                addTitle: _,
                type: _,
                name: _,
                link: _,
                button: _,
                success: _,
                empty: _,
                editSuccess: _,
                deleteSuccess: _,
                edit: o({
                    title: _,
                    button: _
                }),
                delete: o({
                    question: _
                })
            })
        }),
        article: o({
            title: _,
            create: _,
            empty: _,
            image: _,
            articleTitle: _,
            published: _,
            lastEdit: _,
            actions: _,
            form: o({
                back: _,
                editTitle: _,
                createTitle: _,
                details: o({
                    title: _,
                    titleInput: _,
                    titlePlaceholder: _,
                    content: _,
                    editContent: _,
                    previewContent: _,
                    contentPlaceholder: _
                }),
                equipment: o({
                    title: _,
                    select: _,
                    empty: _
                }),
                images: o({
                    title: _,
                    upload: _,
                    descriptionPlaceholder: _,
                    browse: _,
                    button: _,
                    alt: _,
                    empty: _,
                    noImage: _,
                    multiple: _,
                    confirmDelete: _
                }),
                exposures: o({
                    title: _,
                    date: _,
                    type: _,
                    count: _,
                    seconds: _,
                    button: _,
                    time: _,
                    total: _,
                    empty: _,
                    frames: _
                }),
                cancel: _,
                save: _,
                create: _,
                created: _,
                updated: _
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
        types: o({
            form: _,
            empty: _
        }),
        equipment: o({
            form: _,
            url: _
        }),
        upload: o({
            missing: _,
            error: _,
            invalidFile: _,
            extension: _,
            notFound: _
        }),
        article: o({
            notFound: _
        })
    }),
    equipmentType: o({
        telescope: _,
        camera: _,
        mount: _,
        filter: _,
        barlow: _,
        reducer: _,
        guidescope: _,
        phone: _,
        focuser: _
    }),
    frames: o({
        light: _,
        dark: _,
        flat: _,
        bias: _
    })
});
