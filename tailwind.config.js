/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            fontFamily: {
                'fira-sans': ['Fira Sans', 'sans-serif'],
                ubuntu: ['Ubuntu', 'sans-serif'],
                oswald: ['Oswald', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif']
            },
            colors: {
                text: '#e5f9fd',
                background: '#01090c',
                'background-light': '#04222e',
                primary: '#7be6f5',
                secondary: '#991515',
                accent: '#ef8537'
            },

            screens: {
                '3xl': '1920px',
                xsm: '480px'
            },
            width: {
                112: '28rem'
            },
            maxWidth: {
                112: '28rem'
            },
            maxHeight: {
                112: '28rem',
                128: '32rem',
                144: '36rem'
            },
            borderWidth: {
                1: '1px'
            },
            lineClamp: {
                8: '8'
            },
            scale: {
                102: '1.02'
            }
        }
    },
    plugins: []
};
