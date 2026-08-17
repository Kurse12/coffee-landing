import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { WhatsappLogo } from '@phosphor-icons/react'
import Button from '../components/Button'
import { useDemo } from '../lib/demo'
import { gsap } from '../lib/gsap'
import { MEDIA } from '../lib/media'
import { scrollToId } from '../lib/useSmoothScroll'

/*
  Hero a dos paneles: la foto ocupa la mitad izquierda (o el tope, en movil) y
  el titular vive solo, sobre negro plano, en la mitad derecha. El titular
  sigue leyendose en dos tiempos -- linea blanca que presenta, remate en rojo
  al doble de cuerpo -- pero ahora el remate cae sobre void puro en vez de
  sobre el velo de una foto, que es lo que le sigue permitiendo quedar en el
  acento base (ver --color-accent en index.css) sin caer bajo AA.

  Dos capas, una propiedad cada una:
    .hero-media   scroll, yPercent (parallax) + opacity de entrada
    .hero-line    entrada, yPercent por linea (mascara)
  Sin loop perpetuo: la taza flotante desaparecio con el recorte PNG, y esta
  composicion no tiene un objeto recortado que necesite peso fisico propio.
*/
export default function Hero() {
  const root = useRef(null)
  const reduce = useReducedMotion()
  const { abrir } = useDemo()

  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      // Zoom fijo antes de animar nada: es el margen que el parallax de mas
      // abajo necesita para moverse sin destapar un borde vacio contra el
      // overflow-hidden del panel.
      gsap.set('.hero-media', { scale: 1.12 })

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from('.hero-media', { opacity: 0, duration: 1.3 })
        .from('.hero-line > span', { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.3)
        .from('.hero-sub', { y: 14, opacity: 0, duration: 0.8 }, 0.7)
        .from('.hero-cta', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.8)

      gsap.to('.hero-media', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [reduce])

  return (
    <section
      id="inicio"
      ref={root}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden lg:grid lg:grid-cols-2"
    >
      <div className="relative h-[46vh] w-full overflow-hidden lg:h-full">
        <div className="hero-media absolute inset-0">
          <img
            src={MEDIA.hero}
            alt="Café filtrado en V60: agua cayendo sobre el molido, con vapor subiendo"
            fetchPriority="high"
            width={736}
            height={1104}
            className="photo-treat size-full object-cover"
          />
        </div>
        {/* Costura hacia el panel negro: abajo en movil (la foto termina y
            sigue el bloque de texto), a la derecha en desktop (donde linda
            con la columna de texto). Sutil a proposito -- la referencia corta
            limpio, esto solo evita que el borde se lea como un recorte
            accidental. */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-void/55 to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-void/70" />
      </div>

      <div className="relative flex flex-1 items-center bg-void px-5 py-14 text-center lg:px-16 lg:py-0 lg:text-left">
        <div className="relative mx-auto max-w-[560px] lg:mx-0">
          <h1 className="display-xl">
            <span className="hero-line line-mask block text-[clamp(1.7rem,7.5vw,3.1rem)]">
              <span className="block">Caf&eacute; tostado</span>
            </span>
            <span className="hero-line line-mask mt-1 block text-[clamp(3.6rem,13vw,6.4rem)] text-accent">
              <span className="block">ac&aacute; nom&aacute;s</span>
            </span>
          </h1>

          <p className="hero-sub mx-auto mt-6 max-w-[46ch] text-ink-soft lg:mx-0">
            Tostamos los martes, ac&aacute; mismo en Palermo. Lo que ped&iacute;s
            hoy sali&oacute; del tambor hace d&iacute;as, no hace meses.
          </p>

          {/* Una sola accion dominante: Reservar es lo unico que convierte.
              Ver la carta acompaña en ghost, sin pelearle el peso. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:mt-10 lg:justify-start">
            <Button className="hero-cta" onClick={() => abrir('whatsapp')}>
              <WhatsappLogo size={18} weight="fill" />
              Reservar
            </Button>
            <Button className="hero-cta" variant="ghost" onClick={() => scrollToId('carta')}>
              Ver la carta
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
