/*
  Identidad real del autor de la demo. Es lo unico de la pagina que no es
  ficcion, y vive en un solo lugar a proposito: la hoja explicativa, la franja
  de autoria del cierre y cualquier CTA futuro leen de aca.

  Si se clona esto para otra demo, es el primer archivo a tocar. Mientras los
  campos esten vacios, la pagina muestra el marcador en crudo (TU NOMBRE) en vez
  de inventar datos, y avisa por consola en desarrollo.
*/
export const AUTOR = {
  nombre: 'Valentín',
  /** Formato internacional, solo digitos. Ej: 5491155551234 */
  whatsapp: '5491164733773',
  mail: 'aether12@outlook.es',
}

/*
  Mensaje con el que llega el prospecto, ya escrito en el chat. Con tildes: es
  lo primero que se lee en tu nombre, y la pagina entera se apoya en escribir
  bien castellano.
*/
const SALUDO = '¡Hola! Vi la demo de la cafetería y quiero una página para mi negocio.'

export const CONTACTO = {
  get whatsapp() {
    if (!AUTOR.whatsapp) return null
    return `https://wa.me/${AUTOR.whatsapp}?text=${encodeURIComponent(SALUDO)}`
  },
  get mail() {
    if (!AUTOR.mail) return null
    return `mailto:${AUTOR.mail}?subject=${encodeURIComponent('Página para mi negocio')}`
  },
}

export const AUTOR_COMPLETO = Boolean(AUTOR.whatsapp || AUTOR.mail)

if (import.meta.env.DEV && !AUTOR_COMPLETO) {
  console.warn(
    '[demo] src/lib/autor.js sin completar: la pagina no tiene forma de contacto real.',
  )
}
