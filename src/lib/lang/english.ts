import type { z } from 'zod';
import lang from './_template';

export default lang.parse({
    default_desc:
        'Hello, I am Patrik, a student and programmer who enjoys astrophotography in my free time. I create websites and applications using the SvelteKit framework. I am open to creating other applications, for example in NodeJS or other frameworks like Vue.js or React.',
    navigation: {
        home: 'Home',
        home_desc: 'Here you can learn more about me, my interests and the projects I am working on.',
        gallery: 'Gallery',
        gallery_desc: 'Here you can find my astrophotography images that I have taken since I started.'
    }
} satisfies z.infer<typeof lang>);
