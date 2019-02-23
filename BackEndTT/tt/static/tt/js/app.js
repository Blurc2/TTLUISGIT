/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */
/*
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
*/

/* Otherwise just put the config content (json): */

particlesJS('particles-js',
{
  "particles": {
    "number": {
      "value": 10,
      "density": {
        "enable": false,
        "value_area": 1683.5826639087988
      }
    },
    "color": {
      "value": "#29a8b9"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 1,
        "color": "#edf4f5"
      },
      "polygon": {
        "nb_sides": 12
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5772283419115882,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 148.31561563006085,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 153.4825931249542,
        "size_min": 12.993235396821524,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 1747.7191463434199,
      "color": "#0808b6",
      "opacity": 0.5932624625202434,
      "width": 1.9240944730386271
    },
    "move": {
      "enable": true,
      "speed": 4.810236182596568,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 2966.312312601217,
        "rotateY": 2966.312312601217
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": false,
        "mode": "grab"
      },
      "onclick": {
        "enable": false,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": false
}

);