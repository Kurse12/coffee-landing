/*
  Punto unico de reemplazo de imagenes.
  Los archivos viven en src/media, asi que pasan por el pipeline de Vite
  (hash en el nombre y cache larga). Para cambiar una foto alcanza con pisar el
  archivo respetando el aspect ratio que indica cada comentario.
*/
import cookie from '../media/cookie_choco.jpg'
import espresso from '../media/espresso_doble.jpg'
import v60 from '../media/filtrado_v60.jpg'
import flatWhite from '../media/flat_white.jpg'
import interior from '../media/interior.jpg'
import medialuna from '../media/medialuna.jpg'

import granos from '../media/tostamos_martes.jpg'
import arpillera from '../media/descanso_72hs.jpg'
import filtrado from '../media/filtrado_pedido.jpg'
import cookies from '../media/cookies2.jpg'
import vaso from '../media/vaso.jpg'

import salon from '../media/int_horizontal.jpg'

export const MEDIA = {
  /*
    PNG recortado con transparencia. Va suelto sobre el fondo, sin mascara.
    Vive en public/ y no en media/ a proposito: es el elemento LCP y necesita
    una ruta estable para el <link rel="preload"> de index.html. Si se cambia el
    archivo, hay que cambiar el nombre en los dos lugares.
  */
  taza: '/taza-hero.png',
  /* 1:1 tras recorte circular. */
  origen: interior,
  /* 4:5 verticales, un producto por foto. El orden sigue al de ITEMS en Carta. */
  carta: [espresso, flatWhite, v60, cookie, medialuna],
  /*
    Fondos del scroll-stack, uno por tarjeta. Van a sangre y a pantalla
    completa, con un velo oscuro encima, asi que lo que importa es que el sujeto
    quede al centro: el recorte vertical es agresivo en pantallas anchas.
  */
  stack: { granos, arpillera, filtrado, cookies, vaso },
  /* 16:9 al sangrar en la banda de cierre. */
  cierre: salon,
}
