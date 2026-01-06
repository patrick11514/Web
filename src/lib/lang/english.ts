import type { z } from 'zod';
import lang, { _extensions } from './_template';

export default lang.parse({
  default_desc:
    'Hello, I am Patrik, a student and programmer who enjoys astrophotography in my free time. I create websites and applications using the SvelteKit framework. I am open to creating other applications, for example in NodeJS or other frameworks like Vue.js or React.',
  yes: 'Yes',
  no: 'No',
  language: 'Language',
  navigation: {
    home: 'Home',
    gallery: 'Gallery',
    admin: 'Administration',
    login: 'Login',
    contact: 'Contact',
    about: 'About Me'
  },
  adminNavigation: {
    home: 'Dashboard',
    equipment: 'Equipment',
    articles: 'Articles'
  },
  error: {
    title: 'Error',
    message: 'Oops!',
    sub_message: "We don't know this page :(",
    go_home: 'Back home',
    invalid_type_number: 'Please enter a valid number.'
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
        link: '/en/gallery',
        blank: false
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
        priority: 'Priority',
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
          question: 'Are you sure you want to delete this type?'
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
          question: 'Are you sure you want to delete this equipment?'
        }
      }
    },
    article: {
      title: 'Articles',
      create: 'Create new article',
      empty: 'No articles have been created yet.',
      image: 'Image',
      actions: 'Actions',
      articleTitle: 'Article title',
      description: 'Description',
      published: 'Published',
      lastEdit: 'Last edit',
      form: {
        back: 'Back to articles',
        editTitle: 'Edit article',
        createTitle: 'Create article',
        details: {
          title: 'Article details',
          titleInput: 'Article title',
          titlePlaceholder: 'Enter article title',
          description: 'Article description',
          descriptionPlaceholder: 'Enter article description',
          content: 'Article content (Markdown)',
          editContent: 'Edit',
          previewContent: 'Preview',
          contentPlaceholder: 'Enter article content in markdown...'
        },
        equipment: {
          title: 'Equipment',
          select: 'Select equipment',
          empty: 'You have not selected any equipment.'
        },
        images: {
          title: 'Images',
          upload: 'Upload image',
          descriptionPlaceholder: 'Enter image description',
          browse: 'Browse',
          button: 'Add image',
          empty: 'No images have been added yet.',
          alt: 'Please enter image description',
          noImage: 'Please select an image to upload',
          multiple: 'Please select only one image',
          confirmDelete: 'Are you sure you want to delete this image?'
        },
        exposures: {
          title: 'Exposures',
          date: 'Date',
          type: 'Type',
          count: 'Count',
          seconds: 'Seconds',
          button: 'Add exposure',
          time: 'Time (s)',
          total: 'Total (s)',
          empty: 'No exposures have been added yet.',
          frames: 'Frames'
        },
        cancel: 'Cancel',
        save: 'Save article',
        create: 'Create article',
        created: 'Article was successfully created!',
        updated: 'Article was successfully updated!'
      }
    }
  },
  gallery: {
    title: 'Astro-Gallery',
    description:
      'Here you can find astrophotographs taken by me, along with descriptions and details about the exposures.',
    updated: 'Updated',
    created: 'Created',
    readMore: 'Read more',
    more: 'more',
    back: 'Back to gallery',
    totalExposure: 'Total exposure',
    article: 'Article',
    details: 'Technical details',
    equipment: 'Equipment',
    exposureSummary: 'Exposure summary',
    framesCount: {
      '1': 'frames',
      '2': 'frames',
      other: 'frames'
    },
    exposureDetails: 'Exposure details',
    equipmentDetails: 'Equipment details',
    images: 'Images'
  },
  contact: {
    title: 'Get in Touch',
    visit: 'Visit',
    send: 'Send',
    descriptions: {
      github: 'Check out my GitHub, where you can find repositories with my projects',
      email: 'Email me if you have any questions or are interested in collaboration',
      linkedin:
        'Connect with me on LinkedIn, where you can find my professional experience and skills',
      instagram:
        'Follow me on Instagram, where I share my astrophotography and other interesting things',
      twitch: 'Watch me on Twitch, where I stream programming or gaming',
      discord:
        'Add me on Discord, I am most active there and will respond to you the fastest',
      discordServer:
        'If you are interested in what I am up to, definitely join my Discord server'
    }
  },
  about: {
    title: 'Here you will find something about me'
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
      empty: 'Translation key cannot be empty.',
      priority: 'Priority must be a number >=0.'
    },
    equipment: {
      form: 'Please fill in the form',
      url: 'Please enter a valid URL'
    },
    upload: {
      missing: 'Please select a file to upload.',
      error: 'Image upload failed, please try again later.',
      invalidFile: 'Please enter a valid file',
      extension: 'Please enter an image with valid extension: ' + _extensions,
      notFound: 'File with this name does not exist.'
    },
    article: {
      notFound: 'Article with this ID does not exist.',
      noImages: 'Article must contain at least one image.',
      noTitle: 'You need to enter article title.',
      noDescrption: 'You need to enter article description.',
      noContent: 'You need to enter article content.',
      noAltText: 'You need to enter image description.'
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
    phone: 'Phone',
    focuser: 'Focuser'
  },
  frames: {
    light: 'Light',
    dark: 'Dark',
    flat: 'Flat',
    bias: 'Bias'
  }
} satisfies z.infer<typeof lang>);
