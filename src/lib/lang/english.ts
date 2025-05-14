import type { z } from 'zod';
import lang from './_template';

export default lang.parse({
    default_desc:
        'Hello, I am Patrik, a student and programmer who enjoys astrophotography in my free time. I create websites and applications using the SvelteKit framework. I am open to creating other applications, for example in NodeJS or other frameworks like Vue.js or React.',
    navigation: {
        home: 'Home',
        gallery: 'Gallery',
        admin: 'Administration',
        login: 'Login'
    },
    adminNavigation: {
        home: 'Dashboard'
    },
    error: {
        title: 'Error',
        message: 'Oops!',
        sub_message: "We don't know this page :(",
        go_home: 'Back home'
    },
    main: {
        age: 'Age',
        text: [
            '🎓 I am currently studying at ',
            {
                text: 'VŠB – Technical University of Ostrava',
                link: 'https://www.vsb.cz/'
            },
            ', majoring in Computer Science at the ',
            {
                text: 'Faculty of Electrical Engineering and Computer Science',
                link: 'https://www.fei.vsb.cz/'
            },
            '.',
            '%%SPACE%%',
            ' 💻 In my free time, I mostly focus on developing web applications using ',
            {
                text: 'SvelteKit',
                link: 'https://kit.svelte.dev/'
            },
            ', ',
            {
                text: 'Tailwind CSS',
                link: 'https://tailwindcss.com/'
            },
            ', and ',
            {
                text: 'TypeScript',
                link: 'https://www.typescriptlang.org/'
            },
            '. I have experience with both frontend and backend, and I occasionally dive into design as well.',
            '%%SPACE%%',
            ' 🧠 Besides SvelteKit, I also work with other frameworks like ',
            {
                text: 'Vue.js',
                link: 'https://vuejs.org/'
            },
            ' and ',
            {
                text: 'React',
                link: 'https://react.dev/'
            },
            ', so I can adapt to different technologies.',
            '%%SPACE%%',
            ' 🛠️ In Node.js, I also develop various applications such as Discord bots, Twitch bots, and other scripts that simplify life.',
            '%%SPACE%%',
            ' 🌌 Outside of programming, I enjoy astrophotography — you can find my images in ',
            {
                text: 'my gallery',
                link: '/gallery'
            },
            '!'
        ]
    },
    admin: {
        login: {
            title: 'Login',
            username: 'Username',
            password: 'Password',
            submit: 'Login'
        },
        main: {
            stats: 'Statistics',
            today: 'Today',
            week: 'This Week'
        },
        equipment: {
            actions: 'Actions',
            types: {
                title: 'Equipment Types',
                addTitle: 'Editing equipment type',
                translateKey: 'Translate',
                placeholder: 'Type name',
                button: 'Add Type',
                success: 'New type was successfully added!',
                empty: 'No equipment types have been added yet.',
                editSuccess: 'Equpment type name was successfully edited!',
                deleteSuccess: 'Equipment type was successfully deleted!',
                edit: {
                    title: 'Editing equipment type id %1',
                    button: 'Edit'
                },
                delete: {
                    question: 'Are you sure you want to delete this type?',
                    yes: 'Yes',
                    no: 'No'
                }
            },
            equipment: {
                title: 'Equipment',
                addTitle: 'Editing equipment',
                type: 'Type',
                name: 'Name',
                link: 'Link',
                button: 'Add Equipment',
                success: 'New equipment was successfully added!',
                empty: 'No equipment has been added yet.',
                editSuccess: 'Equipment was successfully edited!',
                deleteSuccess: 'Equipment was successfully deleted!',
                edit: {
                    title: 'Editing equipment id %1',
                    button: 'Edit'
                },
                delete: {
                    question: 'Are you sure you want to delete this equipment?',
                    yes: 'Yes',
                    no: 'No'
                }
            }
        }
    },
    errors: {
        internal: 'Internal Server Error, please try again later.',
        login: {
            form: 'Please fill in the form',
            username: 'Invalid username',
            password: 'Invalid password'
        },
        types: {
            form: 'Please fill eqipment type name.',
            empty: 'Translation key cannot be empty.'
        },
        equipment: {
            form: 'Please fill in the form',
            url: 'Please enter a valid URL'
        }
    },
    equipmentType: {
        camera: 'Camera',
        telescope: 'Telescope',
        mount: 'Mount',
        filter: 'Filter',
        barlow: 'Barlow',
        reducer: 'Reducer',
        guidescope: 'Guidescope',
        phone: 'Phone'
    }
} satisfies z.infer<typeof lang>);
