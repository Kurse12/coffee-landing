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

/*
  Tres, no cinco: el ritual paso de cinco tarjetas a tres. Los archivos
  cookies2.jpg y vaso.jpg siguen en src/media pero ya no se importan, asi que
  no entran al bundle. Estan disponibles si alguna seccion los necesita.
*/
import granos from '../media/tostamos_martes.jpg'
import arpillera from '../media/descanso_72hs.jpg'
import filtrado from '../media/filtrado_pedido.jpg'

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
  /*
    Un producto por foto, y el orden sigue al de ITEMS en Carta. Las relaciones
    de los archivos van de 1:1 a 2:3: la tarjeta fija el alto y object-cover
    recorta, asi que lo unico que hay que respetar al cambiar una es que el
    producto quede centrado. Las medidas reales viven junto a cada item en
    Carta.jsx, que es donde el navegador las necesita.
  */
  carta: [espresso, flatWhite, v60, cookie, medialuna],
  /*
    Fondos del scroll-stack, uno por tarjeta. Van a sangre y a pantalla
    completa, con un velo oscuro encima, asi que lo que importa es que el sujeto
    quede al centro: el recorte vertical es agresivo en pantallas anchas.
  */
  stack: { granos, arpillera, filtrado },
  /* 16:9 al sangrar en la banda de cierre. */
  cierre: salon,
}
