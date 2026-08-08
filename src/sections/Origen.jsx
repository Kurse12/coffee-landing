import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { gsap } from '../lib/gsap'
import { MEDIA } from '../lib/media'

const PARRAFOS = [
  'Abrimos en 2016 en un local de nueve metros sobre Honduras, con una máquina prestada y una tostadora de un kilo.',
  'La receta de la cookie salió mal cuarenta y dos veces. La cuarenta y tres es la que seguimos horneando todas las mañanas.',
  'Hoy tostamos para tres locales y para la gente que se lleva el paquete de 250 gramos los sábados.',
]

const RING = 'Café de especialidad / Desde 2016 / '

/*
  Relato con la foto fija y el texto corriendo al lado. El sticky es lo que
  sostiene la escena: mantiene el local a la vista mientras se lee como llego a
  existir, en vez de que la imagen se escape en el primer parrafo.
  El anillo gira con el scroll y funciona como barra de avance del relato.
*/
export default function Origen() {
  const root = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.to('.origen-ring', {
        rotate: 190,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      })

      gsap.from('.origen-reveal', {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.origen-copy', start: 'top 78%' },
      })
    }, root)

    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="origen" ref={root} className="relative py-28 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-5 lg:grid-cols-[0.85fr_1fr] lg:gap-20 lg:px-10">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <div className="relative mx-auto aspect-square w-full max-w-[440px]">
            <svg
              viewBox="0 0 300 300"
              className="origen-ring absolute inset-0 size-full"
              aria-hidden
            >
              <defs>
                <path
                  id="origen-circle"
                  d="M150,150 m-138,0 a138,138 0 1,1 276,0 a138,138 0 1,1 -276,0"
                  fill="none"
                />
              </defs>
              <text
                className="fill-ink-soft text-[13.5px] uppercase"
                style={{ letterSpacing: '0.34em' }}
              >
                <textPath href="#origen-circle">{RING.repeat(2)}</textPath>
              </text>
            </svg>

            <div className="absolute inset-[13%] overflow-hidden rounded-full">
              <img
                src={MEDIA.origen}
                alt="Salon del local con estanterias de madera, plantas colgantes y mesas de bar"
                loading="lazy"
                className="photo-treat size-full object-cover"
                width={1024}
                height={1536}
              />
            </div>
          </div>
        </div>

        <div className="origen-copy">
          <p className="origen-reveal mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
            Nosotros
          </p>

          <h2 className="origen-reveal display-xl max-w-[14ch] text-[clamp(2.4rem,6.2vw,4.6rem)]">
            Empezamos con una m&aacute;quina prestada
          </h2>

          <div className="mt-10 flex flex-col gap-6">
            {PARRAFOS.map((p) => (
              <p
                key={p}
                className="origen-reveal max-w-[58ch] text-lg leading-relaxed text-ink-soft"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="origen-reveal mt-12 flex items-baseline gap-5 border-t border-hairline pt-8">
            <span className="display-xl text-[clamp(3rem,7vw,5rem)] text-accent">42</span>
            <span className="max-w-[22ch] text-sm leading-relaxed text-ink-soft">
              intentos hasta dar con la masa que se sigue horneando hoy
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
