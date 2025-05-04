import type { z } from 'zod';
import lang from './_template';

export default lang.parse({
    default_desc:
        'Ahoj, jsem Patrik, student a programátor, který se ve volném čase věnuje astrofotografování. Věnuji se tvorbě webových stránek a aplikací ve frameworku SvelteKit. Nebráním se tvorbě jiných aplikací, například v NodeJS, nebo jiných frameworkcích, jako jsou Vue.js, nebo React.',
    navigation: {
        home: 'Domů',
        home_desc: 'Zde se dozvíš více o mně, mých zájmech a projektech, na kterých pracuji.',
        gallery: 'Galerie',
        gallery_desc: 'Zde najdeš mé snímky z astrofotografování, které jsem od počátků pořídil.'
    }
} satisfies z.infer<typeof lang>);
