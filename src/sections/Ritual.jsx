import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { Clock, Fire, Funnel, Oven, Recycle } from '@phosphor-icons/react'
import { gsap } from '../lib/gsap'
import { MEDIA } from '../lib/media'

const PASOS = [
  {
    id: 'tostado',
    titulo: 'Tostamos los martes',
    texto:
      'Una carga por semana, en el mismo local donde se toma. Si pasás temprano, el olor te lo confirma antes que el cartel.',
    Icon: Fire,
    foto: MEDIA.stack.granos,
    alt: 'Granos de café recién tostados vistos de cerca',
  },
  {
    id: 'descanso',
    titulo: '72 horas',
    texto:
      'de descanso del grano antes de que toque el molino. Recién tostado no es lo mismo que listo.',
    Icon: Clock,
    foto: MEDIA.stack.arpillera,
    alt: 'Bolsa de arpillera abierta con granos, junto a una taza servida',
    /* Es el unico dato numerico del stack, va en rojo para separarlo del resto. */
    destacado: true,
  },
  {
    id: 'filtrado',
    titulo: 'Filtrado a pedido',
    texto:
      'Te preguntamos el método antes de moler. El grano molido pierde casi todo en veinte minutos.',
    Icon: Funnel,
    foto: MEDIA.stack.filtrado,
    alt: 'Agua cayendo sobre el café molido en el filtro, con la espuma del bloom',
  },
  {
    id: 'horno',
    titulo: 'El horno a las seis',
    texto:
      'La primera tanda de cookies sale justo cuando abrimos la persiana. La segunda, a media tarde.',
    Icon: Oven,
    foto: MEDIA.stack.cookies,
    alt: 'Pila de cookies con chips de chocolate sobre una mesa de madera',
  },
  {
    id: 'vaso',
    titulo: 'Traé tu vaso',
    texto:
      'Si venís con el tuyo, te descontamos el 15% del café. Sin tarjeta de sellos ni vueltas.',
    Icon: Recycle,
    foto: MEDIA.stack.vaso,
    alt: 'Taza de cerámica con café en una mesa junto a la ventana',
  },
]

/*
  Scroll-stack a sangre: cinco tarjetas a pantalla completa que se apilan una
  sobre otra. Motivo: son cinco pasos de un proceso, y apilarlos obliga a
  mirarlos de a uno, en orden, en vez de barrer una grilla de un vistazo.

  El apilado es `position: sticky` (ver index.css). GSAP solo encoge la tarjeta
  saliente hacia su borde superior y le sube un velo oscuro, para que se lea
  como profundidad y no como que desaparecio.
*/
export default function Ritual() {
  const root = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.stack-card')

      cards.forEach((card, i) => {
        const siguiente = cards[i + 1]
        if (!siguiente) return

        // La tarjeta de abajo reacciona al avance de la que viene encima.
        // Config nueva por tween: GSAP escribe sobre el objeto que recibe, asi
        // que compartir uno solo entre los dos los deja pisados.
        const alAvanzarLaSiguiente = () => ({
          trigger: siguiente,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        })

        gsap.to(card.querySelector('.stack-inner'), {
          scale: 0.93,
          ease: 'none',
          scrollTrigger: alAvanzarLaSiguiente(),
        })
        gsap.to(card.querySelector('.stack-scrim'), {
          opacity: 0.72,
          ease: 'none',
          scrollTrigger: alAvanzarLaSiguiente(),
        })
      })

      gsap.from('.ritual-head', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ritual-head', start: 'top 82%' },
      })
    }, root)

    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="ritual" ref={root} className="relative pt-28 lg:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <h2 className="ritual-head display-xl max-w-[16ch] pb-16 text-[clamp(2.4rem,6vw,4.6rem)] lg:pb-24">
          Lo que pasa antes de tu taza
        </h2>
      </div>

      <div>
        {PASOS.map(({ id, titulo, texto, Icon, foto, alt, destacado }) => (
          <div key={id} className="stack-card">
            <div className="stack-inner relative flex min-h-[100dvh] origin-top items-center overflow-hidden rounded-t-card">
              <img
                src={foto}
                alt={alt}
                loading="lazy"
                className="absolute inset-0 size-full object-cover object-center"
              />
              {/* En movil el texto ocupa todo el ancho, asi que el velo tiene
                  que ser parejo. El degradado direccional recien tiene sentido
                  en desktop, donde el texto vive en la mitad izquierda. */}
              <div className="absolute inset-0 bg-void/74 lg:hidden" />
              <div className="absolute inset-0 hidden bg-linear-to-r from-void via-void/80 to-void/25 lg:block" />

              {/* Se oscurece cuando la tarjeta siguiente empieza a taparla. */}
              <div className="stack-scrim pointer-events-none absolute inset-0 bg-void opacity-0" />

              <div className="relative mx-auto w-full max-w-[1400px] px-5 lg:px-10">
                <Icon size={34} className="text-accent-soft" />
                <h3
                  className={`display-xl mt-7 max-w-[13ch] text-[clamp(2.7rem,7.5vw,6.2rem)] ${
                    destacado ? 'text-accent' : 'text-ink'
                  }`}
                >
                  {titulo}
                </h3>
                <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-ink-soft lg:text-xl">
                  {texto}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
