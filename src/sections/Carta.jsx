import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { gsap } from '../lib/gsap'
import { MEDIA } from '../lib/media'

/*
  El alt describe la foto; el nombre del producto ya lo dice el <h3> de al lado
  y repetirlo ahi solo hace que un lector de pantalla lo diga dos veces.

  `w` y `h` son las medidas reales del archivo, una por producto y no una sola
  para las cinco: los originales van de 1:1 a 2:3, asi que un unico par escrito a
  mano describia mal a cuatro de las cinco. Como la tarjeta fija el alto y la
  foto entra con object-cover, la relacion del archivo no cambia el layout, pero
  si es lo que el navegador usa para reservar el espacio antes de decodificar.
*/
const ITEMS = [
  {
    nombre: 'Espresso doble',
    desc: '18 gramos adentro, 36 afuera. Blend de la casa, tostado medio.',
    precio: '$3.400',
    alt: 'Espresso doble en taza de porcelana blanca, con la crema entera sobre una mesa de madera',
    w: 736,
    h: 736,
  },
  {
    nombre: 'Flat white',
    desc: 'Leche texturada corta, sin espuma de más. El pedido que más sale.',
    precio: '$4.600',
    alt: 'Taza blanca con arte en la leche en forma de hoja, sobre su plato',
    w: 1024,
    h: 1024,
  },
  {
    nombre: 'Filtrado V60',
    desc: 'Grano único de Jujuy, molido al momento. Tarda cuatro minutos.',
    precio: '$5.200',
    alt: 'Pava de cuello de cisne vertiendo agua sobre un filtro cónico apoyado en una jarra',
    w: 736,
    h: 1104,
  },
  {
    nombre: 'Cookie de chocolate',
    desc: 'Horneada a las siete. Blanda en el centro, chocolate en trozos.',
    precio: '$3.900',
    alt: 'Cookies de chocolate recién horneadas, con trozos derretidos y sal gruesa arriba',
    w: 680,
    h: 680,
  },
  {
    nombre: 'Medialuna de manteca',
    desc: 'Amasada al lado. Se termina temprano casi todos los días.',
    precio: '$1.800',
    alt: 'Medialunas de manteca glaseadas, apiladas en una sartén de hierro',
    w: 736,
    h: 937,
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
  const scroller = useRef(null)
  const avance = useRef(null)

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
          // El riel sale del mismo trigger que mueve el track, asi que no puede
          // desincronizarse: es el mismo numero dibujado de otra forma.
          onUpdate: (self) => {
            if (avance.current) avance.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
    }, wrap)

    return () => ctx.revert()
  }, [reduce])

  // Bajo reduced-motion el recorrido lo hace el scroller nativo, que ademas
  // lleva la barra oculta: sin el riel no queda ninguna senal de que la carta
  // sigue hacia el costado.
  useEffect(() => {
    if (!reduce) return
    const el = scroller.current
    if (!el) return
    const onScroll = () => {
      const total = el.scrollWidth - el.clientWidth
      if (avance.current) {
        avance.current.style.transform = `scaleX(${total > 0 ? el.scrollLeft / total : 0})`
      }
    }
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
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
        ref={scroller}
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
              className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[27vw]"
            >
              {/* La altura se mide contra la ventana y no contra el ancho de la
                  tarjeta. Con aspect-4/5 sobre un ancho en vw, un telefono
                  acostado da una tarjeta mas alta que la pantalla, y el
                  overflow-hidden del pin la recorta. object-cover se encarga
                  del recorte de la foto.

                  52vh y no 44: en un telefono la tarjeta entera media menos de
                  la mitad de la pantalla, asi que la primera vista de la carta
                  era mayormente negro vacio. Con 52 quedan unos 130 px de aire
                  arriba y abajo, que es respiro y no hueco. El texto sigue
                  entrando incluso con el telefono acostado. */}
              {/* La foto no se agranda al pasar el mouse. La tarjeta no lleva a
                  ningun lado, y ese zoom es el gesto universal de "esto se
                  clickea": prometia una ficha de producto que no existe. Ademas
                  el publico de la pagina entra por telefono, donde no hay hover
                  y el gesto no ocurre nunca. */}
              <div className="relative h-[52vh] overflow-hidden rounded-card bg-surface lg:h-[56vh]">
                <img
                  src={MEDIA.carta[i]}
                  alt={item.alt}
                  loading="lazy"
                  className="photo-treat size-full object-cover"
                  width={item.w}
                  height={item.h}
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

      {/*
        Riel de avance. La seccion se clava y la pagina deja de bajar: sin una
        senal, el que llega no sabe si algo se rompio o si esto es lo que pasa.
        El riel contesta las dos preguntas de una: hay recorrido, y estas por
        aca. Va abajo a la izquierda, sobre el margen de la pagina, y no lleva
        numeros ni flechas porque no es un control, es un estado.

        aria-hidden: con lector de pantalla las tarjetas se leen una atras de la
        otra en el orden del documento, asi que la posicion lateral no describe
        nada que no se sepa ya.
      */}
      <div
        aria-hidden
        className={`h-0.5 w-[140px] overflow-hidden rounded-full bg-hairline ${
          reduce
            ? '-mt-14 mb-14 ml-5 lg:ml-10'
            : 'absolute bottom-8 left-5 z-10 lg:bottom-10 lg:left-10'
        }`}
      >
        <div ref={avance} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  )
}
