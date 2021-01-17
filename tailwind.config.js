// tailwind.config.js


module.exports = {
    purge: [
      './src/**/*.html',
      './src/**/*.js',
    ],
     darkMode: false, // or 'media' or 'class'
     theme: {
       extend: {
        colors: {
          red: {
            light: "#EE2448",
            DEFAULT: "#EE2448",
            dark: "#EE2448"
          },
          blue:{
            light: "#2E3776",
            DEFAULT: "#22295B",
            dark: "#141A4B",
          }
       },
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'tiny': '.875rem',
         'base': '1rem',
         'lg': '1.125rem',
         'xl': '1.35rem',
         '2xl': '1.6rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
         '5xl': '3rem',
         '6xl': '4rem',
        '7xl': '5rem',
       }
     },
     variants: {},
     plugins: [],
   }