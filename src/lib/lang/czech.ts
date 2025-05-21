import type { z } from 'zod';
import lang from './_template';

export default lang.parse({
    default_desc:
        'Ahoj, jsem Patrik, student a programátor, který se ve volném čase věnuje astrofotografování. Věnuji se tvorbě webových stránek a aplikací ve frameworku SvelteKit. Nebráním se tvorbě jiných aplikací, například v NodeJS, nebo jiných frameworkcích, jako jsou Vue.js, nebo React.',
    navigation: {
        home: 'Domů',
        gallery: 'Galerie',
        admin: 'Administrace',
        login: 'Přihlášení'
    },
    adminNavigation: {
        home: 'Panel',
        equipment: 'Vybavení',
        articles: 'Články'
    },
    error: {
        title: 'Chyba',
        message: 'Oops!',
        sub_message: 'Tuto stránku neznáme :(',
        go_home: 'Zpátky domů'
    },
    main: {
        age: 'Věk',
        text: [
            '🎓 Aktuálně studuji na ',
            {
                text: 'Vysoké škole báňské – Technické univerzitě Ostrava',
                link: 'https://www.vsb.cz/'
            },
            ', obor Informatika na ',
            {
                text: 'Fakultě elektrotechniky a informatiky',
                link: 'https://www.fei.vsb.cz/'
            },
            '.',
            '%%SPACE%%',
            ' 💻 Ve volném čase se nejvíce věnuji vývoji webových aplikací pomocí ',
            {
                text: 'SvelteKit',
                link: 'https://kit.svelte.dev/'
            },
            ', ',
            {
                text: 'Tailwind CSS',
                link: 'https://tailwindcss.com/'
            },
            ' a ',
            {
                text: 'TypeScriptu',
                link: 'https://www.typescriptlang.org/'
            },
            '. Mám zkušenosti jak s frontendem, tak backendem a občas zabrousím i do designu.',
            '%%SPACE%%',
            ' 🧠 Kromě SvelteKitu zvládám i práci s jinými frameworky, jako je ',
            {
                text: 'Vue.js',
                link: 'https://vuejs.org/'
            },
            ' nebo ',
            {
                text: 'React',
                link: 'https://react.dev/'
            },
            ', takže se umím přizpůsobit různým technologiím.',
            '%%SPACE%%',
            ' 🛠️ V Node.js vytvářím i různé aplikace jako jsou Discord boti, Twitch boti nebo jiné skripty, které zjednodušují život.',
            '%%SPACE%%',
            ' 🌌 Mimo programování se věnuji také astrofotografii – moje snímky najdeš v ',
            {
                text: 'mé galerii',
                link: '/gallery'
            },
            '!'
        ]
    },
    admin: {
        login: {
            title: 'Přihlášení',
            username: 'Jméno',
            password: 'Heslo',
            submit: 'Přihlásit se'
        },
        main: {
            stats: 'Statistiky',
            today: 'Dnes',
            week: 'Tento týden'
        },
        equipment: {
            actions: 'Akce',
            types: {
                title: 'Typy vybavení',
                addTitle: 'Přidání nového typu',
                translateKey: 'Překlad',
                placeholder: 'Název typu vybavení',
                button: 'Přidat',
                success: 'Nový typ vybavení byl přidán!',
                empty: 'Žádné typy vybavení nebyly přidány.',
                editSuccess: 'Název typu vybavení byl úspěšně upraven!',
                deleteSuccess: 'Typ vybavení byl úspěšně smazán!',
                edit: {
                    title: 'Úprava typu vybavení s id %1',
                    button: 'Upravit'
                },
                delete: {
                    question: 'Opravdu chceš smazat tento typ?',
                    yes: 'Ano',
                    no: 'Ne'
                }
            },
            equipment: {
                title: 'Vybavení',
                addTitle: 'Přidání nového vybavení',
                type: 'Typ',
                name: 'Název',
                link: 'Odkaz',
                button: 'Přidat',
                success: 'Nové vybavení bylo přidáno!',
                empty: 'Žádné vybavení nebylo přidáno.',
                editSuccess: 'Vybavení bylo úspěšně upraveno!',
                deleteSuccess: 'Vybavení bylo úspěšně smazáno!',
                edit: {
                    title: 'Úprava vybavení s id %1',
                    button: 'Upravit'
                },
                delete: {
                    question: 'Opravdu chceš smazat toto vybavení?',
                    yes: 'Ano',
                    no: 'Ne'
                }
            }
        }
    },
    errors: {
        internal: 'Něco se nepovedlo, zkus to prosím zachvíli znova.',
        login: {
            form: 'Vyplň prosím všechny údaje.',
            username: 'Špatné uživatelské jméno.',
            password: 'Špatné heslo.'
        },
        types: {
            form: 'Vyplň prosím název typu vybavení.',
            empty: 'Překladový klíč nesmí být prázdný.'
        },
        equipment: {
            form: 'Vyplň prosím všechny údaje.',
            url: 'Zadej platný odkaz.'
        }
    },
    equipmentType: {
        camera: 'Kamera',
        mount: 'Montáž',
        telescope: 'Dalekohled',
        filter: 'Filtr',
        barlow: 'Barlow',
        reducer: 'Reduktor',
        guidescope: 'Guidescope',
        phone: 'Telefon',
        focuser: 'Zaostřovač'
    }
} satisfies z.infer<typeof lang>);
