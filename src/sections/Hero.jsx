import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import Button from '../components/Button'
import FondoSilk from '../components/FondoSilk'
import { gsap } from '../lib/gsap'
import { MEDIA } from '../lib/media'
import { scrollToId } from '../lib/useSmoothScroll'

/*
  Hero de imagen grande. La taza recortada ocupa el alto util de la ventana y el
  titular se lee en dos tiempos: una linea corta en blanco que entra, y el remate
  en rojo al doble de cuerpo. El peso visual esta repartido entre foto y tipo,
  no entre columnas iguales.

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
          { yPercent: 14, scale: 0.88, rotate: -6, opacity: 0, duration: 1.5 },
          0.1,
        )
        .from('.hero-line > span', { yPercent: 115, duration: 1.1, stagger: 0.1 }, 0.25)
        .from('.hero-cta', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.75)
        // La flotacion arranca recien cuando la taza termino de acomodarse.
        .to(
          '.hero-float',
          { y: -16, duration: 2.8, ease: 'sine.inOut', repeat: -1, yoyo: true },
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
      <FondoSilk />

      {/*
        Capa de textura tipografica, el equivalente propio a las garabateadas de
        tiza del fondo de la referencia: da algo que mirar en el negro sin pelear
        con el contenido. Va por encima del velo para que se vea, y a una
        opacidad tan baja que se lee como marca de agua, no como texto.
        Las dos palabras viven del lado de la foto; la columna derecha queda
        limpia para el titular.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden overflow-hidden select-none lg:block"
      >
        <span className="display-xl absolute top-[6%] -left-[3%] text-[17vw] text-transparent opacity-[0.06] [-webkit-text-stroke:1.5px_var(--color-ink)]">
          Tostado
        </span>
        <span className="display-xl absolute bottom-[4%] left-[18%] text-[13vw] text-transparent opacity-[0.05] [-webkit-text-stroke:1.5px_var(--color-accent)]">
          Cookies
        </span>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-10">
        <div className="relative order-1 flex justify-center lg:order-none">
          {/* Foco detras del recorte. Ahora que el fondo es casi negro vuelve a
              subir: es lo que despega la taza del fondo y evita que el recorte
              se lea como pegado encima. */}
          <div
            aria-hidden
            className="hero-halo pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(125%,800px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/24 blur-[120px]"
          />

          {/*
            El ancho se mide contra la altura de la ventana y no contra la
            columna: es lo que mantiene la foto grande sin empujar los CTA fuera
            del primer viewport. El tope en px existe porque el PNG es de 350
            px de lado y estirarlo mas alla de eso ya se nota blando.
          */}
          <div className="hero-parallax relative w-full max-w-[min(330px,38vh)] sm:max-w-[min(460px,50vh)] lg:max-w-[min(680px,76vh)]">
            <div className="hero-media">
              <div className="hero-float">
                <img
                  src={MEDIA.taza}
                  alt="Taza de flat white con arte en la leche, servida en plato"
                  fetchPriority="high"
                  width={350}
                  height={350}
                  className="w-full [filter:brightness(1.02)_contrast(1.04)_drop-shadow(0_54px_70px_rgba(0,0,0,0.7))]"
                />
              </div>
            </div>
          </div>
        </div>

        {/*
          Centrado en movil, donde el bloque ocupa el ancho completo y alinear a
          la izquierda le deja un vacio raro a la derecha. En desktop vuelve a la
          izquierda, que es lo que sostiene el split asimetrico con la foto.
        */}
        <div className="hero-copy order-2 text-center lg:order-none lg:text-left">
          {/*
            Dos tiempos, no dos lineas iguales: la primera presenta y la segunda
            remata en rojo, a mas del doble de cuerpo.

            El termino en vw de cada clamp es agresivo a proposito. Antes las dos
            lineas quedaban clavadas en su valor minimo en cualquier telefono,
            porque el vw nunca llegaba a superarlo, y por eso el titular se veia
            chico justo donde tenia que gritar. Los topes en rem siguen
            protegiendo el desktop.
          */}
          <h1 className="display-xl">
            <span className="hero-line line-mask block text-[clamp(1.7rem,7.5vw,3.1rem)]">
              <span className="block">Caf&eacute; tostado</span>
            </span>
            <span className="hero-line line-mask mt-1 block text-[clamp(3.6rem,17vw,8rem)] text-accent">
              <span className="block">ac&aacute; nom&aacute;s</span>
            </span>
          </h1>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:mt-10 lg:justify-start">
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
