module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat' : ['Montserrat', 'sans-serif'] 
      },
      keyframes:{
          start:{
            "0%" : {
              opacity: '0%',
              transform: 'translateY(-20px)'
            },
            "25%" : {
              opacity: '25%'
            },
            "50%" : {
              opacity: '50%'
            },
            "75%" : {
              opacity: '75%'
            },
            "100%" : {
              opacity: '100%'
            },
          }
      },
      animation:{
        'starting-animation' : 'start 1s ease-in-out'
      }
    },
  },
  plugins: [],
}

