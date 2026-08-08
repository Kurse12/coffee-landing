import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { gsap } from '../lib/gsap'

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

  Corre a velocidad constante y no escucha al scroll. Antes el scroll le
  modulaba velocidad y direccion, y eso la cortaba: al pasar el hero pegaba un
  tiron y podia darse vuelta. Ademas la velocidad se escribia por dos lados a la
  vez (a mano en cada onUpdate y por un tween al frenar), asi que se pisaban.
  El desplazamiento es exactamente medio track, que son las dos tiras identicas,
  con lo cual el reinicio del loop cae en un punto donde el dibujo es el mismo y
  no se ve costura.
*/
export default function Marquee() {
  const root = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    const ctx = gsap.context(() => {
      gsap.to('.marquee-track', {
        xPercent: -50,
        ease: 'none',
        duration: 26,
        repeat: -1,
      })
    }, root)

    return () => ctx.revert()
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
