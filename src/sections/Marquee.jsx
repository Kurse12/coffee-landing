import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { gsap, ScrollTrigger } from '../lib/gsap'

const WORDS = [
  'Tostado propio',
  'Cookies del día',
  'Filtrado V60',
  'Grano de Jujuy',
  'Espresso doble',
  'Leche de la cuenca',
]

function Strip({ hidden }) {
  return (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {WORDS.map((w, i) => (
        <li key={w} className="flex shrink-0 items-center gap-10">
          <span
            className={`display-xl text-[clamp(1.7rem,4.4vw,3.2rem)] ${
              i % 2 ? 'text-accent' : 'text-ink'
            }`}
          >
            {w}
          </span>
          <span aria-hidden className="text-2xl leading-none text-ink-faint">
            /
          </span>
        </li>
      ))}
    </ul>
  )
}

/*
  Unica banda cinetica de la pagina. Motivo: separa el hero de la historia y
  enumera los rasgos del lugar sin gastar una seccion entera en una lista.
  El scroll modula direccion y velocidad, asi la banda responde al usuario
  en vez de girar sola, indiferente a lo que hace.
*/
export default function Marquee() {
  const root = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    let idleTimer

    const ctx = gsap.context(() => {
      const loop = gsap.to('.marquee-track', {
        xPercent: -50,
        ease: 'none',
        duration: 26,
        repeat: -1,
      })

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          loop.timeScale(gsap.utils.clamp(-6, 6, 1 + self.getVelocity() / 320))
          clearTimeout(idleTimer)
          // Al frenar el scroll vuelve a su marcha base en vez de quedar
          // clavada en la ultima velocidad.
          idleTimer = setTimeout(() => {
            gsap.to(loop, { timeScale: 1, duration: 0.6, overwrite: true })
          }, 180)
        },
      })
    }, root)

    return () => {
      clearTimeout(idleTimer)
      ctx.revert()
    }
  }, [reduce])

  return (
    <section
      ref={root}
      aria-label="Lo que servimos"
      className="relative overflow-hidden border-y border-hairline bg-surface py-7"
    >
      <div className="marquee-track flex w-max">
        <Strip />
        <Strip hidden />
      </div>
    </section>
  )
}
