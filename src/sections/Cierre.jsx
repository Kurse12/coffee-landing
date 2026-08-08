import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import {
  CheckCircle,
  CircleNotch,
  InstagramLogo,
  TiktokLogo,
  WhatsappLogo,
} from '@phosphor-icons/react'
import Button from '../components/Button'
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
    if (!EMAIL_RE.test(email.trim())) {
      setEstado('error')
      setError('Revisá el email, parece que le falta algo.')
      return
    }
    setError('')
    setEstado('enviando')
    // Demo: no hay backend. Reemplazar por el POST real al proveedor de mails.
    await new Promise((r) => setTimeout(r, 900))
    setEstado('ok')
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
          <h2 className="display-xl max-w-[16ch] text-[clamp(2.6rem,7vw,5.4rem)]">
            Te guardamos <span className="text-accent">la mesa del fondo</span>
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-ink-soft">
            Reservas por WhatsApp de lunes a viernes. Los fines de semana es por orden de
            llegada.
          </p>
          <Button
            as="a"
            href="https://wa.me/5491100000000"
            target="_blank"
            rel="noreferrer"
            className="mt-9"
          >
            <WhatsappLogo size={18} weight="fill" />
            Pedir por WhatsApp
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
              Caf&eacute; de especialidad tostado en Palermo. Demo generica, sin marca real
              detr&aacute;s.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { href: 'https://instagram.com', label: 'Instagram', Icon: InstagramLogo },
                { href: 'https://tiktok.com', label: 'TikTok', Icon: TiktokLogo },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-accent hover:text-ink"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Secciones">
            <ul className="flex flex-col gap-3">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => scrollToId(n.id)}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            {estado === 'ok' ? (
              <p className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                <CheckCircle size={18} weight="fill" className="mt-px shrink-0 text-accent-soft" />
                Listo. Te escribimos cuando salga un tostado nuevo.
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
                    className="min-w-0 flex-1 rounded-full border border-hairline bg-surface-2 px-5 py-3 text-sm text-ink placeholder:text-ink-soft focus:border-accent focus:outline-none disabled:opacity-60"
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
                    Un mail por mes como mucho. Te dás de baja cuando quieras.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 border-t border-hairline px-5 py-7 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>
            {LOCALES.map((l) => l.calle).join(' / ')}
          </p>
          <p>Proyecto de demostraci&oacute;n. Contenido y precios ficticios.</p>
        </div>
      </div>
    </footer>
  )
}
