import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import {
  CheckCircle,
  CircleNotch,
  EnvelopeSimple,
  InstagramLogo,
  TiktokLogo,
  WhatsappLogo,
} from '@phosphor-icons/react'
import Button from '../components/Button'
import { AUTOR, AUTOR_COMPLETO, CONTACTO } from '../lib/autor'
import { useDemo } from '../lib/demo'
import { gsap } from '../lib/gsap'
import { MEDIA } from '../lib/media'
import { LOCALES } from '../lib/locales'
import { scrollToId } from '../lib/useSmoothScroll'

const NAV = [
  { id: 'carta', label: 'Carta' },
  { id: 'origen', label: 'Nosotros' },
  { id: 'locales', label: 'Locales' },
  { id: 'voces', label: 'Voces' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/*
  Cierre a sangre completa. La foto es el salon con las mesas vacias, que es
  literalmente lo que promete el titular. Lo unico animado es su zoom lento al
  entrar en pantalla: cierra el recorrido y empuja la vista hacia el CTA.
  El rango de zoom es corto a proposito, el original mide 735 px de ancho y
  ampliarlo mas lo deja blando.
*/
export default function Cierre() {
  const root = useRef(null)
  const reduce = useReducedMotion()
  const { abrir } = useDemo()

  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState('idle') // idle | enviando | ok | error
  const [error, setError] = useState('')

  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cierre-bg',
        { scale: 1.12, yPercent: -3 },
        {
          scale: 1,
          yPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [reduce])

  const enviar = async (e) => {
    e.preventDefault()
    const limpio = email.trim()
    if (!EMAIL_RE.test(limpio)) {
      setEstado('error')
      setError('Revisá el email, parece que le falta algo.')
      return
    }
    setError('')
    setEstado('enviando')
    try {
      // Demo: no hay backend. Reemplazar por el POST real al proveedor de mails.
      await new Promise((r) => setTimeout(r, 900))
      setEstado('ok')
    } catch {
      // La rama existe antes que el backend a proposito: cuando entre el POST
      // real, un 500 tiene que decir algo. Sin esto un error de red se ve
      // exactamente igual que no haber apretado el boton.
      setEstado('error')
      setError('No se pudo enviar. Probá de nuevo en un momento.')
    }
  }

  return (
    <footer id="cierre" ref={root} className="relative">
      <section className="relative isolate overflow-hidden bg-void">
        <img
          src={MEDIA.cierre}
          alt="Salon del local con las mesas vacias y la barra al fondo"
          loading="lazy"
          width={735}
          height={490}
          className="cierre-bg absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-void/76" />

        <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-5 py-32 text-center lg:px-10 lg:py-44">
          {/* accent-soft y no accent: el titular va sobre la foto del salon, que
              tiene paredes blancas y lamparas encendidas. Con el velo puesto,
              accent mide 2,0:1 contra esas zonas. Ver la regla en index.css. */}
          <h2 className="display-xl max-w-[16ch] text-[clamp(2.6rem,7vw,5.4rem)]">
            Te guardamos <span className="text-accent-soft">la mesa del fondo</span>
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-ink-soft">
            Reservas por WhatsApp de lunes a viernes. Los fines de semana es por orden de
            llegada.
          </p>
          {/* El local no existe, asi que este boton no puede abrir un chat.
              Abre la hoja que explica que haria en el sitio del cliente y deja
              el contacto real: es el momento en que el visitante quiso actuar. */}
          <Button onClick={() => abrir('whatsapp')} className="mt-9">
            <WhatsappLogo size={18} weight="fill" />
            Reservar por WhatsApp
          </Button>
        </div>
      </section>

      <div className="border-t border-hairline bg-void">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:gap-16 lg:px-10">
          <div>
            <p className="font-display text-3xl uppercase leading-none tracking-tight">
              Cafeter&iacute;a
            </p>
            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-ink-soft">
              Caf&eacute; de especialidad tostado en Palermo, entre Soho, Hollywood y
              Recoleta.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { label: 'Instagram', Icon: InstagramLogo },
                { label: 'TikTok', Icon: TiktokLogo },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  onClick={() => abrir('redes')}
                  aria-label={`${label} de la cafetería (demo)`}
                  className="grid size-11 place-items-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-accent hover:text-ink"
                >
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </div>

          <nav aria-label="Secciones">
            {/* min-h-11 en vez de gap: los renglones quedan de 44 px y se pueden
                tocar con el pulgar. Antes median 20 px de alto.
                El -mt-3 compensa el aire que ese alto le mete arriba al primer
                renglon: sin el, "Carta" queda 12 px mas abajo que el titulo de
                la columna de al lado y las tres columnas arrancan desparejas.
                Solo en lg: abajo de eso las columnas se apilan, no hay nada al
                lado con que emparejarse, y el margen negativo solo comeria el
                aire entre bloques. */}
            <ul className="flex flex-col lg:-mt-3">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => scrollToId(n.id)}
                    className="inline-flex min-h-11 items-center text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* El exito reemplaza al form, asi que sin region viva un lector de
              pantalla se queda con el foco en un boton que ya no existe y sin
              enterarse de nada. Y como el form desaparece, el mail confirmado
              se repite aca: es la unica forma de ver si quedo bien escrito. */}
          <div aria-live="polite">
            {estado === 'ok' ? (
              <p className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                <CheckCircle size={18} weight="fill" className="mt-px shrink-0 text-accent-soft" />
                <span>
                  Listo. Te escribimos a <strong className="font-semibold">{email.trim()}</strong>{' '}
                  cuando salga un tostado nuevo.
                </span>
              </p>
            ) : (
              <form onSubmit={enviar} noValidate className="flex flex-col gap-2">
                <label htmlFor="mail" className="text-sm font-medium text-ink">
                  Avisos de tostado nuevo
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="mail"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (estado === 'error') setEstado('idle')
                    }}
                    placeholder="vos@correo.com"
                    aria-invalid={estado === 'error'}
                    aria-describedby={estado === 'error' ? 'mail-error' : 'mail-help'}
                    disabled={estado === 'enviando'}
                    /* El borde tambien cambia con el error: con el mensaje solo,
                       el campo que hay que corregir no se distinguia del que
                       esta bien, y el que mira el formulario mira el campo. */
                    className="min-w-0 flex-1 rounded-full border border-hairline bg-surface-2 px-5 py-3 text-sm text-ink placeholder:text-ink-soft focus:border-accent focus:outline-none disabled:opacity-60 aria-invalid:border-accent-soft"
                  />
                  <Button type="submit" disabled={estado === 'enviando'} className="sm:px-6">
                    {estado === 'enviando' ? (
                      <>
                        <CircleNotch size={16} weight="bold" className="animate-spin" />
                        Enviando
                      </>
                    ) : (
                      'Sumarme'
                    )}
                  </Button>
                </div>
                {estado === 'error' ? (
                  <p id="mail-error" className="text-xs text-accent-soft">
                    {error}
                  </p>
                ) : (
                  <p id="mail-help" className="text-xs text-ink-soft">
                    Un mail por mes como mucho. Te das de baja cuando quieras.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* El borde va afuera y la caja de ancho maximo adentro: al reves la
            linea de direcciones arrancaba 20 px a la izquierda del resto del
            footer, porque la caja de 1400 y el padding se aplicaban al mismo
            elemento en vez de anidarse como en el resto de la pagina. */}
        <div className="border-t border-hairline">
          <p className="mx-auto max-w-[1400px] px-5 py-7 text-xs text-ink-soft lg:px-10">
            {LOCALES.map((l) => l.calle).join(' / ')}
          </p>
        </div>
      </div>

      {/*
        Unico lugar donde la pagina rompe personaje, y lo hace del lado de
        afuera del footer ficticio para que se lea como otra voz. Va al final
        porque el visitante recien decidio si le gusto: es el momento en que la
        pregunta "quien hizo esto" tiene respuesta util.

        En superficie propia y en text-ink, no en el gris mas tenue: es lo unico
        de la pagina escrito para quien la esta evaluando.
      */}
      <aside
        aria-label="Sobre esta demo"
        className="border-t border-hairline bg-surface"
      >
        <div className="mx-auto flex max-w-[1400px] flex-col gap-7 px-5 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-10">
          <div>
            <p className="font-display text-2xl leading-none tracking-tight uppercase sm:text-3xl">
              Hasta ac&aacute;, todo inventado
            </p>
            <p className="mt-4 max-w-[54ch] text-sm leading-relaxed text-ink-soft">
              La cafeter&iacute;a no existe: los precios, los horarios y las tres
              direcciones son ficticios. La p&aacute;gina s&iacute; existe, y la hice yo,{' '}
              <strong className="font-semibold text-ink">{AUTOR.nombre}</strong>. Si
              ten&eacute;s un local y quer&eacute;s una as&iacute;, escribime y lo
              charlamos.
            </p>
          </div>

          {AUTOR_COMPLETO ? (
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
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
            <p className="shrink-0 rounded-card border border-dashed border-accent-soft/50 px-4 py-3 text-sm text-accent-soft">
              Completar <code>src/lib/autor.js</code>
            </p>
          )}
        </div>
      </aside>
    </footer>
  )
}
