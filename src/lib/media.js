/*
  Punto unico de reemplazo de imagenes.
  Los archivos viven en src/media, asi que pasan por el pipeline de Vite
  (hash en el nombre y cache larga). Para cambiar una foto alcanza con pisar el
  archivo respetando el aspect ratio que indica cada comentario.
*/
import alfajor from '../media/alfajor.jpg'
import bagel from '../media/bagel.jpg'
import budinLimon from '../media/budin_limon.jpg'
import chaiLatte from '../media/chai_latte.jpg'
import coldBrew from '../media/cold_brew.jpg'
import cookie from '../media/cookie_choco.jpg'
import cortado from '../media/cortado.jpg'
import espresso from '../media/espresso_doble.jpg'
import v60 from '../media/filtrado_v60.jpg'
import flatWhite from '../media/flat_white.jpg'
import interior from '../media/interior.jpg'
import latte from '../media/latte.jpg'
import manzanilla from '../media/manzanilla.jpg'
import matchaLatte from '../media/matcha_latte.jpg'
import medialuna from '../media/medialuna.jpg'
import scon from '../media/scon.jpg'
import tablaQuesos from '../media/tabla_quesos.jpg'
import teVerde from '../media/te_verde.jpg'
import tostado from '../media/tostado.jpg'

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
    JPG del hero (panel izquierdo, a sangre). Vive en public/ y no en media/ a
    proposito, igual que antes con la taza: es el elemento LCP y necesita una
    ruta estable para el <link rel="preload"> de index.html. Si se cambia el
    archivo, hay que cambiar el nombre en los dos lugares. Duplicado del mismo
    archivo que usa carta[2] (filtrado_v60): a proposito, es la unica foto del
    banco que sostiene el mood de la referencia (mano sirviendo, vapor, calido).
  */
  hero: '/hero-cafe.jpg',
  /* 1:1 tras recorte circular. */
  origen: interior,
  /*
    La carta (CartaCompleta.jsx), en el mismo orden en que aparecen sus ITEMS.
    Las relaciones de los archivos van de 1:1 a 2:3: la tarjeta fija el alto y
    object-cover recorta, asi que lo unico que hay que respetar al cambiar una
    es que el producto quede centrado. Las medidas reales viven junto a cada
    item en CartaCompleta.jsx, que es donde el navegador las necesita.
  */
  menu: {
    espresso: { src: espresso },
    cortado: { src: cortado },
    flatWhite: { src: flatWhite },
    latte: { src: latte },
    v60: { src: v60 },
    coldBrew: { src: coldBrew },
    teVerde: { src: teVerde },
    chaiLatte: { src: chaiLatte },
    matchaLatte: { src: matchaLatte },
    manzanilla: { src: manzanilla },
    medialuna: { src: medialuna },
    cookie: { src: cookie },
    budinLimon: { src: budinLimon },
    alfajor: { src: alfajor },
    scon: { src: scon },
    tostado: { src: tostado },
    bagel: { src: bagel },
    tablaQuesos: { src: tablaQuesos },
  },
  /*
    Fondos del scroll-stack, uno por tarjeta. Van a sangre y a pantalla
    completa, con un velo oscuro encima, asi que lo que importa es que el sujeto
    quede al centro: el recorte vertical es agresivo en pantallas anchas.
  */
  stack: { granos, arpillera, filtrado },
  /* 16:9 al sangrar en la banda de cierre. */
  cierre: salon,
}
