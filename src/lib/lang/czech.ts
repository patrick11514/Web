import type { z } from 'zod';
import lang, { _extensions } from './_template';

export default lang.parse({
  default_desc:
    'Ahoj, jsem Patrik, student a programátor, který se ve volném čase věnuje astrofotografování. Věnuji se tvorbě webových stránek a aplikací ve frameworku SvelteKit. Nebráním se tvorbě jiných aplikací, například v NodeJS, nebo jiných frameworkcích, jako jsou Vue.js, nebo React.',
  yes: 'Ano',
  no: 'Ne',
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
        link: '/cs/gallery',
        blank: false
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
        priority: 'Priorita',
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
          question: 'Opravdu chceš smazat tento typ?'
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
          question: 'Opravdu chceš smazat toto vybavení?'
        }
      }
    },
    article: {
      title: 'Články',
      create: 'Vytvořit článek',
      empty: 'Žádné články nebyly vytvořeny.',
      articleTitle: 'Název článku',
      description: 'Popisek',
      image: 'Obrázek',
      lastEdit: 'Poslední úprava',
      published: 'Publikováno',
      actions: 'Akce',
      form: {
        back: 'Zpátky k článkům',
        editTitle: 'Upravit článek',
        createTitle: 'Vytvořit článek',
        details: {
          title: 'Detaily článku',
          titleInput: 'Název článku',
          titlePlaceholder: 'Zadej název článku',
          description: 'Popis článku',
          descriptionPlaceholder: 'Zadej krátký popis článku',
          content: 'Obsah článku (Markdown)',
          editContent: 'Úprava',
          previewContent: 'Náhled',
          contentPlaceholder: 'Zadej obsah článku v markdownu...'
        },
        equipment: {
          title: 'Vybavení',
          select: 'Vyber vybavení',
          empty: 'Nevybral jsi žádné vybavení.'
        },
        images: {
          title: 'Obrázky',
          upload: 'Nahrát obrázek',
          descriptionPlaceholder: 'Zadej popis obrázku',
          browse: 'Procházet',
          button: 'Přidat obrázek',
          alt: 'Zadej prosím popisek obrázku',
          empty: 'Zatím nebyl přidán žádný obrázek.',
          noImage: 'Vyber prosím obrázek',
          multiple: 'Vyber prosím pouze jeden obrázek',
          confirmDelete: 'Opravdu chceš smazat tento obrázek?'
        },
        exposures: {
          title: 'Expozice',
          date: 'Datum',
          type: 'Typ',
          count: 'Počet',
          seconds: 'Sekundy',
          button: 'Přidat expozici',
          time: 'Čas (s)',
          total: 'Celkový čas (s)',
          empty: 'Zatím jsi nepřidal žádnou expozici.',
          frames: 'Snímky'
        },
        cancel: 'Zrušit',
        save: 'Uložit článek',
        create: 'Vytvořit článek',
        created: 'Článek byl úspěšně vytvořen!',
        updated: 'Článek byl úspěšně upraven!'
      }
    }
  },
  gallery: {
    title: 'Astro-Galerie',
    description: 'Zde nalezneš astrofotografie pořízené mnou, společně s popisy a detaily o expozicích.',
    updated: 'Aktualizováno',
    created: 'Vytvořeno',
    readMore: 'Čti dále',
    more: 'více',
    back: 'Zpět na galerii',
    totalExposure: 'Celkový čas expozice',
    article: 'Článek',
    details: 'Technické detaily',
    equipment: 'Použité vybavení',
    exposureSummary: 'Souhrn expozic',
    framesCount: {
      '1': 'snímek',
      '2': 'snímky',
      other: 'snímků'
    },
    exposureDetails: 'Detaily expozic',
    equipmentDetails: 'Detaily vybavení',
    images: 'Obrázky'
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
      empty: 'Překladový klíč nesmí být prázdný.',
      priority: 'Priorita musí být číslo >=0.'
    },
    equipment: {
      form: 'Vyplň prosím všechny údaje.',
      url: 'Zadej platný odkaz.'
    },
    upload: {
      missing: 'Vyber prosím soubor k nahrání.',
      error: 'Nepodařilo se nahrát soubor, zkus to prosím znovu.',
      invalidFile: 'Nahrej prosím platný soubor',
      extension: 'Nahrej prosím platný obrázek s příponou ' + _extensions,
      notFound: 'Soubor s tímto jménem neexistuje.'
    },
    article: {
      notFound: 'Článek s tímto id neexistuje.',
      noImages: 'Článek musí obsahovat alespoň jeden obrázek.'
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
  },
  frames: {
    light: 'Light',
    dark: 'Dark',
    flat: 'Flat',
    bias: 'Bias'
  }
} satisfies z.infer<typeof lang>);
