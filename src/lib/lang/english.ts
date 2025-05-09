import type { z } from 'zod';
import lang from './_template';

export default lang.parse({
    default_desc:
        'Hello, I am Patrik, a student and programmer who enjoys astrophotography in my free time. I create websites and applications using the SvelteKit framework. I am open to creating other applications, for example in NodeJS or other frameworks like Vue.js or React.',
    navigation: {
        home: 'Home',
        gallery: 'Gallery',
        admin: 'Administration'
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
        }
    },
    errors: {
        login: {
            form: 'Please fill in the form',
            username: 'Invalid username',
            password: 'Invalid password'
        }
    }
} satisfies z.infer<typeof lang>);
