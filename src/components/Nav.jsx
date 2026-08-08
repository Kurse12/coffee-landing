import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Coffee, InstagramLogo, List, TiktokLogo, X } from '@phosphor-icons/react'
import { lockScroll, scrollToId } from '../lib/useSmoothScroll'

const LINKS = [
  { id: 'carta', label: 'Carta' },
  { id: 'origen', label: 'Nosotros' },
  { id: 'locales', label: 'Locales' },
  { id: 'cierre', label: 'Contacto' },
]

const SOCIALS = [
  { href: 'https://instagram.com', label: 'Instagram', Icon: InstagramLogo },
  { href: 'https://tiktok.com', label: 'TikTok', Icon: TiktokLogo },
]

export default function Nav() {
  const [scrolleado, setScrolleado] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  // useScroll evita el listener de scroll manual; el estado solo cambia al
  // cruzar el umbral, no en cada frame.
  useMotionValueEvent(scrollY, 'change', (v) => {
    const next = v > 48
    setScrolleado((prev) => (prev === next ? prev : next))
  })

  // Con el panel abierto no se scrollea por detras, y Escape lo cierra.
  useEffect(() => {
    if (!open) return
    lockScroll(true)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [open])

  // Al cruzar a desktop el panel se esconde por CSS, pero el estado seguiria en
  // abierto y el scroll congelado sin nada visible que lo explique. Pasa al
  // rotar una tablet.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const go = (id) => {
    setOpen(false)
    // Se libera antes de navegar: si el scroll sigue congelado cuando Lenis
    // recibe el destino, el salto no ocurre.
    lockScroll(false)
    scrollToId(id)
  }

  /*
    El fondo se pinta en el <header>, que contiene barra y panel. Asi el menu
    abierto arriba de todo es una sola superficie continua, y no una franja
    transparente con un panel opaco colgando.
  */
  const opaco = scrolleado || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        opaco
          ? 'border-b border-hairline bg-void/90 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-5 lg:px-10">
        <button
          onClick={() => go('inicio')}
          className="flex shrink-0 items-center gap-2.5 text-left"
          aria-label="Ir al inicio"
        >
          <Coffee size={26} weight="fill" className="shrink-0 text-accent-soft" />
          <span className="font-display text-[19px] leading-none tracking-tight uppercase">
            Cafeter&iacute;a
          </span>
        </button>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="text-[13px] font-medium tracking-[0.08em] text-ink-soft uppercase transition-colors hover:text-ink"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-accent hover:text-ink"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="grid size-11 place-items-center rounded-full border border-hairline text-ink transition-colors hover:border-accent lg:hidden"
          >
            {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-hairline lg:hidden"
          >
            <ul className="flex flex-col px-4 py-3 sm:px-5">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    className="w-full py-3.5 text-left font-display text-2xl tracking-tight uppercase"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Debajo de sm los sociales salen de la barra por falta de ancho,
                asi que reaparecen aca adentro. */}
            <div className="flex gap-2 border-t border-hairline px-4 py-4 sm:hidden">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full border border-hairline text-ink-soft"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
