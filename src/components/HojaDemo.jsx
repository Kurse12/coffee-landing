import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EnvelopeSimple, WhatsappLogo, X } from '@phosphor-icons/react'
import Button from './Button'
import { AUTOR, AUTOR_COMPLETO, CONTACTO } from '../lib/autor'
import { DemoContext } from '../lib/demo'
import { lockScroll } from '../lib/useSmoothScroll'

/*
  Hoja explicativa de los CTA ficticios.

  El problema que resuelve: la cafeteria no existe, asi que su WhatsApp y sus
  redes no pueden llevar a ningun lado. Un wa.me invalido no se lee como
  marcador de posicion, se lee como link roto, y quien mira esta evaluando
  justamente si el autor termina las cosas.

  En vez de esconder el boton o desactivarlo, lo interceptamos: sigue siendo el
  CTA de la cafeteria, pero al tocarlo explica que haria en el sitio del cliente
  y ofrece el unico contacto real de la pagina. El punto mas debil pasa a ser el
  momento de venta, y ocurre justo cuando el visitante quiso actuar.

  Es de las pocas cosas de la pagina que merecen interrumpir: cambia el marco de
  ficcion a realidad, y necesita foco atrapado para que con teclado no se siga
  tabulando por una pagina que ya no es la que se esta leyendo.
*/

const COPY = {
  whatsapp: {
    titulo: 'Este botón sería tuyo',
    cuerpo:
      'En tu sitio abre WhatsApp con tu número y el mensaje ya escrito, así el cliente solo aprieta enviar. Acá no lleva a ningún lado: la cafetería no existe.',
  },
  redes: {
    titulo: 'Estos íconos serían tuyos',
    cuerpo:
      'En tu sitio van a tus perfiles reales, y se actualizan solos cuando cambiás de usuario. Acá no llevan a ningún lado: la cafetería no existe.',
  },
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

export function DemoProvider({ children }) {
  const [origen, setOrigen] = useState(null)
  const panel = useRef(null)
  const veniaDe = useRef(null)
  const reduce = useReducedMotion()

  const abrir = useCallback((desde) => {
    veniaDe.current = document.activeElement
    setOrigen(desde)
  }, [])

  const cerrar = useCallback(() => setOrigen(null), [])

  useEffect(() => {
    if (!origen) return
    lockScroll(true)

    // El foco entra al panel y no sale hasta que se cierre: con la hoja abierta
    // el resto de la pagina ya no es lo que se esta leyendo.
    //
    // Entra al panel y no al primer boton: el primero en el orden del documento
    // es "Cerrar", asi que con lector de pantalla la hoja se anunciaba como
    // "Cerrar, boton", sin decir de que hoja se trata. Enfocando el contenedor
    // se lee el titulo y el cuerpo, y recien despues se tabula a los controles.
    const nodo = panel.current
    nodo?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        cerrar()
        return
      }
      if (e.key !== 'Tab' || !nodo) return
      const focusables = [...nodo.querySelectorAll(FOCUSABLE)]
      if (!focusables.length) return
      const primero = focusables[0]
      const ultimo = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      // Devolver el foco al boton que la abrio: sin esto, con teclado se vuelve
      // al principio del documento y hay que rehacer todo el recorrido.
      veniaDe.current?.focus?.()
    }
  }, [origen, cerrar])

  const copy = origen ? COPY[origen] : null

  return (
    <DemoContext.Provider value={{ abrir }}>
      {children}

      <AnimatePresence>
        {copy && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
            <motion.div
              onClick={cerrar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              className="absolute inset-0 bg-void/85 backdrop-blur-sm"
            />

            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="hoja-demo-titulo"
              tabIndex={-1}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.99 }}
              transition={{ duration: reduce ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
              /* max-h + scroll propio: con los dos botones de contacto puestos,
                 en un telefono bajo la hoja no entra y sin esto el ultimo CTA
                 queda debajo del borde, sin forma de alcanzarlo. */
              /* Sin contorno de foco: el panel recibe el foco por codigo y no
                 esta en el orden de tabulacion, asi que el anillo no señala
                 nada operable. Dibujado, es un rectangulo rojo alrededor de
                 toda la hoja. Los controles de adentro conservan el suyo. */
              className="relative m-3 max-h-[85dvh] w-full max-w-[520px] overflow-y-auto rounded-card border border-hairline bg-surface p-6 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.9)] focus-visible:outline-none sm:m-0 sm:p-8"
            >
              <button
                onClick={cerrar}
                aria-label="Cerrar"
                className="absolute top-4 right-4 grid size-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X size={18} weight="bold" />
              </button>

              <h2
                id="hoja-demo-titulo"
                className="max-w-[16ch] font-display text-3xl leading-none tracking-tight uppercase sm:text-4xl"
              >
                {copy.titulo}
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{copy.cuerpo}</p>

              <div className="mt-7 border-t border-hairline pt-6">
                <p className="text-sm leading-relaxed text-ink">
                  La p&aacute;gina s&iacute; existe, y la hice yo:{' '}
                  <strong className="font-semibold">{AUTOR.nombre}</strong>. Si quer&eacute;s
                  una as&iacute; para tu local, escribime y lo charlamos.
                </p>

                {AUTOR_COMPLETO ? (
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    {CONTACTO.whatsapp && (
                      <Button as="a" href={CONTACTO.whatsapp} target="_blank" rel="noreferrer">
                        <WhatsappLogo size={18} weight="fill" />
                        Escribime
                      </Button>
                    )}
                    {CONTACTO.mail && (
                      <Button as="a" variant="ghost" href={CONTACTO.mail}>
                        <EnvelopeSimple size={18} />
                        Mandarme un mail
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="mt-5 rounded-card border border-dashed border-accent-soft/50 px-4 py-3 text-sm text-accent-soft">
                    Falta completar <code>src/lib/autor.js</code> con tu nombre y tu
                    contacto real.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DemoContext.Provider>
  )
}
