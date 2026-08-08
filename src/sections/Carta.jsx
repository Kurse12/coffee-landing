import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { gsap } from '../lib/gsap'
import { MEDIA } from '../lib/media'

const ITEMS = [
  {
    nombre: 'Espresso doble',
    desc: '18 gramos adentro, 36 afuera. Blend de la casa, tostado medio.',
    precio: '$3.400',
  },
  {
    nombre: 'Flat white',
    desc: 'Leche texturada corta, sin espuma de más. El pedido que más sale.',
    precio: '$4.600',
  },
  {
    nombre: 'Filtrado V60',
    desc: 'Grano único de Jujuy, molido al momento. Tarda cuatro minutos.',
    precio: '$5.200',
  },
  {
    nombre: 'Cookie de chocolate',
    desc: 'Horneada a las siete. Blanda en el centro, chocolate en trozos.',
    precio: '$3.900',
  },
  {
    nombre: 'Medialuna de manteca',
    desc: 'Amasada al lado. Se termina temprano casi todos los días.',
    precio: '$1.800',
  },
]

/*
  Recorrido horizontal en todos los anchos, incluido movil. La seccion se clava
  a pantalla completa y el scroll vertical se traduce en desplazamiento lateral,
  asi que la carta se recorre de a un producto por vez.

  Unica excepcion, y es obligatoria: bajo prefers-reduced-motion no hay pin. Si
  lo dejaramos, la seccion quedaria clavada con el track recortado y no habria
  forma de llegar a los productos. Ahi cae a un carrusel nativo con snap.
*/
export default function Carta() {
  const wrap = useRef(null)
  const track = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return

    const ctx = gsap.context(() => {
      // Se recalcula en cada refresh: en movil la barra de direcciones cambia
      // la altura y el ancho de las tarjetas esta en vw.
      const distancia = () => track.current.scrollWidth - window.innerWidth

      gsap.to(track.current, {
        x: () => -distancia(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${distancia()}`,
          pin: true,
          // Bajo a la par del lerp de Lenis. Aca el scrub no es decoracion:
          // es la navegacion de la seccion, y con el scroll mas rapido un
          // retardo alto la deja arrastrandose atras del dedo.
          scrub: 0.4,
          // Adelanta el pin unos pixeles para que no salte si se entra rapido.
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, wrap)

    return () => ctx.revert()
  }, [reduce])

  return (
    <section
      id="carta"
      ref={wrap}
      className={`relative ${reduce ? '' : 'h-[100dvh] overflow-hidden'}`}
    >
      {/*
        Con el pin activo este div no hace nada, solo pasa la altura.
        Bajo reduced-motion se convierte en el scroller nativo: snap para que
        cada producto frene solo, scroll-pl-5 para que frene respetando el
        margen lateral en vez de pegarse al borde, y overscroll-x-contain para
        que el swipe pasado el ultimo no dispare el gesto de "atras".
      */}
      <div
        className={
          reduce
            ? 'snap-x snap-mandatory scroll-pl-5 overflow-x-auto overscroll-x-contain py-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            : 'h-full'
        }
      >
        <div
          ref={track}
          className={`flex w-max gap-5 px-5 lg:gap-8 lg:px-10 ${
            reduce ? '' : 'h-full items-center'
          }`}
        >
          <header className="flex w-[84vw] shrink-0 flex-col justify-center sm:w-[52vw] lg:w-[34vw]">
            <p className="mb-5 text-[11px] font-semibold tracking-[0.28em] text-accent-soft uppercase">
              La carta
            </p>
            <h2 className="display-xl text-[clamp(2.6rem,6.5vw,5rem)]">
              Lo que sale
              <br />
              <span className="text-accent">de la barra</span>
            </h2>
            <p className="mt-7 max-w-[34ch] leading-relaxed text-ink-soft">
              Cinco cosas fijas todo el año. El resto rota con lo que llega de la finca.
            </p>
          </header>

          {ITEMS.map((item, i) => (
            <article
              key={item.nombre}
              className="group w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[27vw]"
            >
              {/* La altura se mide contra la ventana y no contra el ancho de la
                  tarjeta. Con aspect-4/5 sobre un ancho en vw, un telefono
                  acostado da una tarjeta mas alta que la pantalla, y el
                  overflow-hidden del pin la recorta. object-cover se encarga
                  del recorte de la foto. */}
              <div className="relative h-[44vh] overflow-hidden rounded-card bg-surface sm:h-[50vh] lg:h-[56vh]">
                <img
                  src={MEDIA.carta[i]}
                  alt={item.nombre}
                  loading="lazy"
                  className="photo-treat size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                  width={900}
                  height={1125}
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                {/* min-w-0 deja que el nombre largo parta en dos renglones en
                    vez de empujar el precio fuera de la tarjeta. */}
                <h3 className="min-w-0 font-display text-xl leading-[0.95] tracking-tight uppercase lg:text-2xl">
                  {item.nombre}
                </h3>
                <span className="shrink-0 font-display text-lg leading-[0.95] text-accent-soft lg:text-xl">
                  {item.precio}
                </span>
              </div>
              <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-ink-soft">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
