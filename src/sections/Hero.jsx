import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import Button from '../components/Button'
import { gsap } from '../lib/gsap'
import { MEDIA } from '../lib/media'
import { scrollToId } from '../lib/useSmoothScroll'

/*
  Hero split asimetrico. La taza es un PNG recortado, asi que va suelta sobre el
  fondo (sin mascara ni marco) y se anima como objeto, no como foto.

  Cuatro capas anidadas, una propiedad por capa, para que las animaciones no se
  pisen entre si:
    .hero-media    entrada, opacity + scale + rotate
    .hero-parallax scroll, yPercent
    .hero-float    loop infinito, y
    img            estatica

  Los cuatro motivos:
   1. Entrada de la taza: es el objeto protagonista, entra ultima y sola.
   2. Lineas del titular subiendo desde su mascara: fija el orden de lectura.
   3. Flotacion: unico loop perpetuo de la pagina. Le da peso fisico al recorte,
      que si no queda pegado como una calcomania.
   4. Parallax al salir: la taza sube mas lento que el texto, avisa que hay
      recorrido sin necesidad de poner un cartel de "scroll".
*/
export default function Hero() {
  const root = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from('.hero-halo', { scale: 0.6, opacity: 0, duration: 1.6 })
        .from(
          '.hero-media',
          { yPercent: 18, scale: 0.86, rotate: -7, opacity: 0, duration: 1.5 },
          0.1,
        )
        .from('.hero-line > span', { yPercent: 115, duration: 1.1, stagger: 0.09 }, 0.25)
        .from('.hero-sub', { y: 18, opacity: 0, duration: 0.9 }, 0.7)
        .from('.hero-cta', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.82)
        // La flotacion arranca recien cuando la taza termino de acomodarse.
        .to(
          '.hero-float',
          {
            y: -14,
            duration: 2.6,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          },
          '>-0.3',
        )

      gsap.to('.hero-parallax', {
        yPercent: -16,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-copy', {
        yPercent: -26,
        opacity: 0.15,
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
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-20 pb-14 lg:pt-24 lg:pb-16"
    >
      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-5 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-10">
        <div className="relative order-1 flex justify-center lg:order-none">
          {/* Halo de marca detras del recorte, para que la taza no quede
              flotando en el vacio. Un solo acento, sin glow neon. */}
          <div
            aria-hidden
            className="hero-halo pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(115%,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/22 blur-[90px]"
          />

          {/* El ancho se ata tambien a la altura de la ventana, no solo al
              ancho: en telefonos bajos (una SE) una taza de 280 px empuja los
              CTA abajo del pliegue. */}
          <div className="hero-parallax relative w-full max-w-[min(280px,30vh)] sm:max-w-[min(340px,34vh)] lg:max-w-[min(44vh,420px)]">
            <div className="hero-media">
              <div className="hero-float">
                <img
                  src={MEDIA.taza}
                  alt="Taza de flat white con arte en la leche, servida en plato"
                  fetchPriority="high"
                  width={350}
                  height={350}
                  className="w-full [filter:brightness(0.97)_drop-shadow(0_34px_44px_rgba(0,0,0,0.6))]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-copy order-2 lg:order-none">
          <h1 className="display-xl text-[clamp(2.9rem,9vw,6.2rem)]">
            <span className="hero-line line-mask block">
              <span className="block">Caf&eacute; tostado</span>
            </span>
            <span className="hero-line line-mask block text-accent">
              <span className="block">ac&aacute; nom&aacute;s</span>
            </span>
          </h1>

          <p className="hero-sub mt-6 max-w-[46ch] text-base leading-relaxed text-ink-soft lg:mt-7 lg:text-lg">
            Tostamos en Palermo cada martes y horneamos las cookies a la ma&ntilde;ana. Tres
            locales, cero misterio.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 lg:mt-9">
            <Button className="hero-cta" onClick={() => scrollToId('carta')}>
              Ver la carta
            </Button>
            <Button
              className="hero-cta"
              variant="ghost"
              onClick={() => scrollToId('locales')}
            >
              D&oacute;nde estamos
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
